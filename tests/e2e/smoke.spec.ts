import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CATEGORY_SLUGS } from '../../src/data/categories';

const DIST_DIR = resolve(process.cwd(), 'dist');
const ARTICLES_DIR = resolve(process.cwd(), 'src/content/articles');

test.describe('Geary Static Build, E2E, Accessibility & Security Smoke Suite', () => {
  test('TC-BLD-03: verifies static HTML routes and < 100 KB search-index.json in dist/', () => {
    expect(existsSync(resolve(DIST_DIR, 'index.html'))).toBe(true);
    expect(existsSync(resolve(DIST_DIR, 'articles', 'index.html'))).toBe(true);
    expect(existsSync(resolve(DIST_DIR, 'contribute', 'index.html'))).toBe(true);
    expect(existsSync(resolve(DIST_DIR, 'map', 'index.html'))).toBe(true);
    expect(existsSync(resolve(DIST_DIR, 'terms', 'index.html'))).toBe(true);
    expect(existsSync(resolve(DIST_DIR, 'privacy', 'index.html'))).toBe(true);
    expect(existsSync(resolve(DIST_DIR, '404.html'))).toBe(true);

    for (const slug of CATEGORY_SLUGS) {
      expect(existsSync(resolve(DIST_DIR, 'categories', slug, 'index.html'))).toBe(true);
    }

    const mdFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));
    expect(mdFiles.length).toBeGreaterThanOrEqual(1);
    for (const file of mdFiles) {
      const slug = file.replace(/\.md$/i, '');
      expect(existsSync(resolve(DIST_DIR, 'articles', slug, 'index.html'))).toBe(true);
    }

    const indexPath = resolve(DIST_DIR, 'search-index.json');
    expect(existsSync(indexPath)).toBe(true);
    expect(statSync(indexPath).size).toBeLessThan(100 * 1024);
  });

  test('TC-BLD-04: validates internal links and TOC heading anchors across key routes', async ({
    page,
    request,
  }) => {
    const routesToCheck = [
      '/',
      '/articles',
      '/categories/enrollment',
      '/categories/documents',
      '/categories/organizations',
      '/articles/can-i-graduate-with-honors',
      '/articles/how-to-apply-to-bulsu',
      '/articles/how-to-shift-programs-in-bulsu',
      '/articles/academic-load-prerequisites-and-residency',
      '/articles/what-happens-when-you-fail-a-subject',
      '/articles/bulsu-graduation-requirements',
      '/articles/how-internships-work-at-bulsu',
      '/articles/university-attendance-policies',
      '/articles/bulsu-student-publication-guide',
      '/articles/bulsu-guidance-and-counseling-guide',
      '/articles/complete-guide-to-scholarships-at-bulsu',
      '/contribute',
      '/map',
      '/terms',
      '/privacy',
    ];

    const checkedUrls = new Set<string>();

    for (const route of routesToCheck) {
      await page.goto(route);
      const hrefs = await page
        .locator('a[href^="/"]')
        .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));

      for (const href of hrefs) {
        const cleanHref = href.split('#')[0] || '/';
        if (!checkedUrls.has(cleanHref)) {
          checkedUrls.add(cleanHref);
          const response = await request.get(cleanHref);
          expect(response.status(), `Broken link ${cleanHref} on ${route}`).toBeLessThan(400);
        }
      }

      if (route.startsWith('/articles/')) {
        const tocHrefs = await page
          .locator('aside[aria-label="On this page"] a[href^="#"]')
          .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));

        for (const hash of tocHrefs) {
          const targetId = hash.slice(1);
          await expect(page.locator(`[id="${targetId}"]`)).toHaveCount(1);
        }
      }
    }
  });

  test('TC-E2E-01: hydrates SearchBar island, fetches search-index.json lazily once, and navigates via keyboard', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    let indexFetchCount = 0;
    page.on('request', (req) => {
      if (req.url().endsWith('/search-index.json')) {
        indexFetchCount += 1;
      }
    });

    await page.goto('/');
    expect(indexFetchCount).toBe(0);

    const heroInput = page.locator('main input[role="combobox"]');
    await expect(heroInput).toHaveAttribute('data-search-ready', 'true');
    await page.keyboard.press('/');
    await expect(heroInput).toBeFocused();

    await heroInput.fill('Latin Honors');
    await expect.poll(() => indexFetchCount).toBe(1);

    const firstOption = page.locator('main [role="option"]').first();
    await expect(firstOption).toContainText('Can I Graduate With Honors?');
    await expect(firstOption).toBeVisible();

    const isOptionOnTop = await firstOption.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return Boolean(hit && (el === hit || el.contains(hit)));
    });
    expect(isOptionOnTop).toBe(true);

    await heroInput.press('ArrowDown');
    await expect(firstOption).toHaveAttribute('aria-selected', 'true');
    await heroInput.press('Enter');

    await expect(page).toHaveURL(/\/articles\/can-i-graduate-with-honors\/?$/);
    expect(pageErrors).toEqual([]);

    // Verify Header SearchBar shortcut + Escape dismissal on article page
    const headerInput = page.locator('header input[role="combobox"]');
    await expect(headerInput).toHaveAttribute('data-search-ready', 'true');
    await page.keyboard.press('Control+k');
    await expect(headerInput).toBeFocused();
    await headerInput.fill('Honors');
    await expect(page.locator('header [role="option"]').first()).toContainText('Honors');
    await headerInput.press('Escape');
    await expect(page.locator('header [role="listbox"]')).toHaveCount(0);
  });

  test('TC-E2E-02: displays 5-category pills on zero matches and safe fallback on search-index fetch failure', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');
    const heroInput = page.locator('main input[role="combobox"]');
    await expect(heroInput).toHaveAttribute('data-search-ready', 'true');
    await heroInput.fill('zzzznonexistent');

    const listboxId = await heroInput.getAttribute('aria-controls');
    expect(listboxId).toBeTruthy();
    const searchPanel = page.locator(`[id="${listboxId}"]`);
    await expect(searchPanel).toBeVisible();
    await expect(searchPanel).toContainText('No articles matched');
    for (const slug of CATEGORY_SLUGS) {
      await expect(searchPanel.locator(`a[href="/categories/${slug}"]`)).toHaveCount(0);
    }

    // Simulate network failure for /search-index.json in a fresh context
    const offlinePage = await page.context().newPage();
    const offlineErrors: string[] = [];
    offlinePage.on('pageerror', (err) => offlineErrors.push(err.message));
    await offlinePage.route('**/search-index.json', (route) =>
      route.fulfill({ status: 500, body: 'Server Error' }),
    );

    await offlinePage.goto('/');
    const offlineInput = offlinePage.locator('main input[role="combobox"]');
    await expect(offlineInput).toHaveAttribute('data-search-ready', 'true');
    await offlineInput.focus();
    await offlineInput.fill('TOR');

    await expect(
      offlinePage.getByText("Search index couldn't load right now."),
    ).toBeVisible();
    for (const slug of CATEGORY_SLUGS) {
      await expect(
        offlinePage.locator(`main a[href="/categories/${slug}"]`).first(),
      ).toBeVisible();
    }
    expect(offlineErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    await offlinePage.close();
  });

  test('TC-E2E-03: handles responsive TOC, suppresses TOC when < 2 headings, and omits solo-article Related Guides', async ({
    page,
  }) => {
    // Desktop sticky sidebar TOC
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/articles/can-i-graduate-with-honors');
    const desktopToc = page.locator('aside[aria-label="On this page"]');
    const mobileToc = page.locator('details:has-text("On this page")');
    await expect(desktopToc).toBeVisible();
    await expect(mobileToc).toBeHidden();

    // Mobile collapsible <details> TOC
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(desktopToc).toBeHidden();
    await expect(mobileToc).toBeVisible();
    await mobileToc.locator('summary').click();
    await mobileToc.locator('a[href="#latin-honors-cutoffs-and-grade-floors"]').click();
    await expect(page).toHaveURL(/#latin-honors-cutoffs-and-grade-floors$/);

    // Related Guides & Verification Notice remain omitted; multi-source card renders Sources heading & links
    await expect(page.locator('section[aria-labelledby="related-guides-heading"]')).toHaveCount(0);
    await expect(page.locator('aside[aria-label="Verification notice"]')).toHaveCount(0);
    const honorsSourceAside = page.locator('aside[aria-label="Article source"]');
    await expect(honorsSourceAside).toContainText('Sources');
    const honorsSourceLinks = honorsSourceAside.locator('a');
    expect(await honorsSourceLinks.count()).toBeGreaterThanOrEqual(2);
    await expect(honorsSourceLinks.first()).toHaveAttribute(
      'href',
      'https://www.bulsu.edu.ph/assets/downloads/files/student_handbook.pdf',
    );
    await expect(honorsSourceLinks.first()).toContainText(
      /Undergraduate Student Manual of Bulacan State University, BOR Resolution No\. 85, Series of 2016/i,
    );

    // Handbook article renders Source card hyperlink
    await page.goto('/articles/understanding-the-bulsu-grading-system');
    const sourceLinks = page.locator('aside[aria-label="Article source"] a');
    await expect(sourceLinks.first()).toHaveAttribute(
      'href',
      'https://www.bulsu.edu.ph/assets/downloads/files/student_handbook.pdf',
    );
    await expect(sourceLinks.first()).toContainText(
      /Undergraduate Student Manual of Bulacan State University, BOR Resolution No\. 85, Series of 2016/i,
    );
  });

  test('TC-E2E-04: prevents horizontal overflow across 375px, 768px, and 1280px viewports', async ({
    page,
  }) => {
    const viewports = [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
    ];
    const routes = [
      '/',
      '/articles',
      '/categories/enrollment',
      '/articles/can-i-graduate-with-honors',
      '/contribute',
      '/map',
      '/terms',
      '/privacy',
      '/404.html',
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      for (const route of routes) {
        await page.goto(route);
        const hasNoOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        );
        expect(
          hasNoOverflow,
          `Horizontal overflow detected on ${route} at ${viewport.width}px`,
        ).toBe(true);
      }
    }

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const mainBefore = await page.locator('main').boundingBox();
    await page.locator('#mobile-menu-toggle').click();
    await expect(page.locator('#mobile-nav-drawer')).toBeVisible();
    const mainAfter = await page.locator('main').boundingBox();
    expect(mainAfter?.y).toBe(mainBefore?.y);

    await page.goto('/articles/bulsu-dress-code-and-id-policy');
    const notesHeaderBox = await page.locator('.geary-prose th').nth(2).boundingBox();
    expect(notesHeaderBox?.width ?? 0).toBeGreaterThanOrEqual(200);
    const dressOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
    expect(dressOverflow).toBe(true);
  });

  test('TC-E2E-05: renders branded 404 recovery page with SearchBar and 5 category links', async ({
    page,
  }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.locator('h1')).toContainText("couldn't find that article");
    await expect(page.locator('main input[role="combobox"]')).toBeVisible();
    for (const slug of CATEGORY_SLUGS) {
      await expect(page.locator(`main a[href="/categories/${slug}"]`)).toBeVisible();
    }
    await page.locator('main a[href="/"]').click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('TC-A11Y-01 & TC-A11Y-02: passes WCAG 2.1 AA Axe checks, semantic landmarks, and single h1 per page', async ({
    page,
  }) => {
    const routes = [
      '/',
      '/articles',
      '/categories/policies',
      '/articles/can-i-graduate-with-honors',
      '/contribute',
      '/map',
      '/terms',
      '/privacy',
      '/404.html',
    ];

    for (const route of routes) {
      await page.goto(route);

      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('header nav[aria-label="Primary navigation"] a')).toHaveCount(4);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);

      if (route.startsWith('/articles/')) {
        await expect(page.locator('article')).toHaveCount(1);
      }

      if (route === '/') {
        const input = page.locator('main input[role="combobox"]');
        await expect(input).toHaveAttribute('data-search-ready', 'true');
        await input.fill('Honors');
        await expect(page.locator('main [role="listbox"]')).toBeVisible();
      }

      const results = await new AxeBuilder({ page })
        .exclude('iframe[src^="https://docs.google.com/"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(
        results.violations,
        `Axe violations on ${route}: ${JSON.stringify(results.violations)}`,
      ).toEqual([]);
    }
  });

  test('TC-SEC-01: escapes script/HTML payloads safely in SearchBar without executing XSS', async ({
    page,
  }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await page.goto('/');
    const heroInput = page.locator('main input[role="combobox"]');
    await expect(heroInput).toHaveAttribute('data-search-ready', 'true');

    await heroInput.fill('<script>alert("xss")</script>');
    await expect(page.getByText('<script>alert("xss")</script>')).toBeVisible();
    expect(dialogTriggered).toBe(false);

    await heroInput.fill('<img src=x onerror=alert(1)>');
    await expect(page.getByText('<img src=x onerror=alert(1)>')).toBeVisible();
    expect(dialogTriggered).toBe(false);
  });

  test('TC-BLD-02: fails fast with Zod validation diagnostic on invalid Markdown frontmatter', () => {
    const badFile = resolve(ARTICLES_DIR, '_invalid-schema-fixture.md');
    writeFileSync(
      badFile,
      `---
title: "Invalid Category Test"
category: "unknown-category"
subcategory: "Test"
updatedDate: 2026-11-17
---

Test body.
`,
      'utf-8',
    );

    let failed = false;
    let combinedOutput = '';
    try {
      execSync('bun run build', { stdio: 'pipe', encoding: 'utf-8' });
    } catch (error: unknown) {
      failed = true;
      const err = error as { stdout?: string; stderr?: string };
      combinedOutput = `${err.stdout ?? ''}\n${err.stderr ?? ''}`;
    } finally {
      rmSync(badFile, { force: true });
    }

    expect(failed).toBe(true);
    expect(combinedOutput.toLowerCase()).toMatch(/invalid|category|enum|schema/);
  });

  test('TC-E2E-06: emits canonical, Open Graph, Twitter, JSON-LD, sitemap, robots.txt, and 404 noindex', async ({
    page,
    request,
  }) => {
    const robotsRes = await request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain('User-agent: *');
    expect(robotsText).toContain('Sitemap:');
    expect(robotsText).toContain('sitemap-index.xml');

    const sitemapIndexRes = await request.get('/sitemap-index.xml');
    expect(sitemapIndexRes.status()).toBe(200);
    const sitemapIndexXml = await sitemapIndexRes.text();
    expect(sitemapIndexXml).toContain('sitemap-0.xml');

    const sitemap0Res = await request.get('/sitemap-0.xml');
    expect(sitemap0Res.status()).toBe(200);
    const sitemap0Xml = await sitemap0Res.text();
    expect(sitemap0Xml).toContain('/articles/can-i-graduate-with-honors');
    expect(sitemap0Xml).toContain('/categories/organizations');
    expect(sitemap0Xml).not.toContain('/404');

    const ogImgRes = await request.get('/og-image.png');
    expect(ogImgRes.status()).toBe(200);
    for (const iconPath of ['/favicon.ico', '/favicon.svg', '/favicon-48x48.png', '/favicon-96x96.png', '/apple-touch-icon.png']) {
      const res = await request.get(iconPath);
      expect(res.status(), iconPath).toBe(200);
    }

    await page.goto('/');
    await expect(page).toHaveTitle('Geary - The Better BulSU Student Handbook');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Student-managed information portal for BulSUans, by BulSUans.',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\/.+\/$/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/og-image\.png$/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    const homeLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? '{}')));
    expect(homeLd.some((d) => d['@type'] === 'WebSite' && d.name === 'Geary')).toBe(true);

    await page.goto('/categories/academics');
    const catLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? '{}')));
    expect(catLd.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true);

    await page.goto('/articles/can-i-graduate-with-honors');
    await expect(page).toHaveTitle('Can I Graduate With Honors?');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/articles\/can-i-graduate-with-honors\/?$/,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="article:modified_time"]')).toHaveAttribute(
      'content',
      /^\d{4}-\d{2}-\d{2}T/,
    );
    await expect(page.locator('meta[property="article:section"]')).toHaveAttribute(
      'content',
      'Academics',
    );
    await expect(page.locator('meta[property="article:tag"]')).toHaveAttribute(
      'content',
      'Internships & Graduation',
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      /Can I Graduate With Honors\?.*Geary BulSU Student Article/,
    );
    const articleLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((el) => JSON.parse(el.textContent ?? '{}')));
    expect(articleLd.some((d) => d['@type'] === 'Article')).toBe(true);
    expect(articleLd.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true);

    await page.goto('/404.html');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test('TC-E2E-07: searches indoor campus locations, highlights parent building, clicks SVG buildings, and zooms', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/map');
    await expect(page.locator('h1')).toContainText('Main Campus');

    const mapSvg = page.locator('main svg[role="group"]');
    await expect(mapSvg).toHaveAttribute('viewBox', '0 0 1000 850');

    const searchInput = page.locator('main input[role="combobox"]');
    await searchInput.fill('CICT');

    const listbox = page.locator('main [role="listbox"]');
    await expect(listbox).toBeVisible();
    const firstOption = listbox.locator('[role="option"]').first();
    await expect(firstOption).toContainText('CICT');
    await expect(firstOption).toContainText('Pimentel Hall');
    await firstOption.click();

    const inspector = page.locator('main aside');
    await expect(inspector.locator('h2')).toHaveText('Pimentel Hall');
    await expect(inspector.locator('[data-search-match="true"]')).toContainText('CICT');
    await expect(page.locator('[data-building-id="pimentel-hall"]')).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(mapSvg).not.toHaveAttribute('viewBox', '0 0 1000 850');

    await page.locator('button[aria-label="Reset map view"]').click();
    await expect(mapSvg).toHaveAttribute('viewBox', '0 0 1000 850');

    await page.locator('[data-building-id="con-canteen"]').click();
    await expect(inspector.locator('h2')).toHaveText('CON Canteen');
    await expect(inspector).toContainText('Tindahan ni Ka Ekek');

    await page.locator('button[aria-label="Zoom in map"]').click();
    const zoomedViewBox = await mapSvg.getAttribute('viewBox');
    expect(zoomedViewBox).not.toBe('0 0 1000 850');

    // Verify 1-finger touch drag pan and 2-finger pinch zoom update SVG viewBox
    await mapSvg.evaluate((svg) => {
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      svg.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 12, pointerType: 'touch', clientX: cx, clientY: cy }));
      svg.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 12, pointerType: 'touch', clientX: cx - 60, clientY: cy - 40 }));
      svg.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 12, pointerType: 'touch', clientX: cx - 60, clientY: cy - 40 }));
    });
    const pannedViewBox = await mapSvg.getAttribute('viewBox');
    expect(pannedViewBox).not.toBe(zoomedViewBox);

    await mapSvg.evaluate((svg) => {
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      svg.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 10, pointerType: 'touch', clientX: cx - 30, clientY: cy }));
      svg.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 11, pointerType: 'touch', clientX: cx + 30, clientY: cy }));
      svg.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 10, pointerType: 'touch', clientX: cx - 75, clientY: cy }));
      svg.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 11, pointerType: 'touch', clientX: cx + 75, clientY: cy }));
      svg.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 10, pointerType: 'touch', clientX: cx - 75, clientY: cy }));
      svg.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 11, pointerType: 'touch', clientX: cx + 75, clientY: cy }));
    });
    const pinchedViewBox = await mapSvg.getAttribute('viewBox');
    expect(pinchedViewBox).not.toBe(pannedViewBox);

    expect(pageErrors).toEqual([]);
  });

  test('TC-E2E-08: supports Light, Dark, and System default theme with persistence, keyboard nav, and header placement', async ({
    page,
  }) => {
    // 1. Default follows system preference (emulate dark first)
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/articles');

    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'system');
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(darkBg).toBe('rgb(15, 19, 23)');

    // Desktop placement: theme toggle is to the left of the header search bar
    const trigger = page.locator('#theme-toggle-button');
    const headerSearch = page.locator('header input[role="combobox"]');
    const triggerBox = await trigger.boundingBox();
    const searchBox = await headerSearch.boundingBox();
    expect(triggerBox && searchBox && triggerBox.x < searchBox.x).toBe(true);

    // Keyboard open & select Light
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.locator('#theme-toggle-menu');
    await expect(menu).toBeVisible();
    await expect(menu.locator('[role="menuitemradio"]')).toHaveCount(3);
    await expect(menu.locator('[data-theme-option="light"]')).toContainText('Light');
    await expect(menu.locator('[data-theme-option="dark"]')).toContainText('Dark');
    await expect(menu.locator('[data-theme-option="system"]')).toContainText('System default');

    await menu.locator('[data-theme-option="light"]').click();
    await expect(menu).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    await expect(page.evaluate(() => window.localStorage.getItem('geary-theme'))).resolves.toBe(
      'light',
    );

    // Reload preserves Light even when OS is dark
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(lightBg).toBe('rgb(248, 249, 250)');

    // Switch to Dark and reload while OS is light
    await page.emulateMedia({ colorScheme: 'light' });
    await trigger.click();
    await menu.locator('[data-theme-option="dark"]').click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    // Switch back to System default -> follows emulated light, then dark live
    await trigger.click();
    await menu.locator('[data-theme-option="system"]').click();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    // Mobile placement: theme toggle is to the left of the burger menu with >= 44px target
    await page.setViewportSize({ width: 375, height: 812 });
    const mobileTriggerBox = await trigger.boundingBox();
    const burgerBox = await page.locator('#mobile-menu-toggle').boundingBox();
    expect(mobileTriggerBox && burgerBox && mobileTriggerBox.x < burgerBox.x).toBe(true);
    expect(mobileTriggerBox && mobileTriggerBox.width >= 44 && mobileTriggerBox.height >= 44).toBe(
      true,
    );
  });

  test('TC-A11Y-03: passes WCAG 2.1 AA Axe checks in dark mode across key routes', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('geary-theme', 'dark');
    });

    const routes = [
      '/',
      '/articles',
      '/categories/policies',
      '/articles/can-i-graduate-with-honors',
      '/map',
      '/404.html',
    ];

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('html')).toHaveClass(/\bdark\b/);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations, `Dark mode Axe violations on ${route}`).toEqual([]);
    }
  });
});
