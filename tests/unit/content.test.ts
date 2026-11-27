/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  loadArticlesFromRawMap,
  parseArticleMarkdown,
  slugifyHeading,
} from '../../src/lib/server/markdown';

describe('Markdown content loader & Zod validation (TC-BLD-02)', () => {
  test('validates and compiles every repository article in src/content/articles/', () => {
    const articlesDir = resolve(process.cwd(), 'src/content/articles');
    const mdFiles = readdirSync(articlesDir).filter((file) => file.endsWith('.md'));
    expect(mdFiles.length).toBeGreaterThanOrEqual(20);

    const rawMap: Record<string, string> = {};
    for (const file of mdFiles) {
      const fullPath = resolve(articlesDir, file);
      rawMap[fullPath] = readFileSync(fullPath, 'utf-8');
    }

    const articles = loadArticlesFromRawMap(rawMap);
    expect(articles.length).toBe(mdFiles.length);

    const honors = articles.find((a) => a.slug === 'can-i-graduate-with-honors');
    expect(honors).toBeDefined();
    expect(honors?.headings.some((h) => h.slug === 'latin-honors-cutoffs-and-grade-floors')).toBe(
      true,
    );
    expect(honors?.html).toContain('id="latin-honors-cutoffs-and-grade-floors"');
  });

  test('normalizes dynamic categories and rejects empty category or missing title', () => {
    const dynamicCategory = `---
title: "Dynamic Category Test"
category: "  Student Life  "
categoryIcon: "campus"
updatedDate: 2026-11-17
---

Body text.
`;
    const parsed = parseArticleMarkdown('dynamic-category.md', dynamicCategory);
    expect(parsed.data.category).toBe('student-life');
    expect(parsed.data.categoryIcon).toBe('campus');

    const emptyCategory = `---
title: "Empty Category Test"
category: "   "
updatedDate: 2026-11-17
---

Body text.
`;
    expect(() => parseArticleMarkdown('bad-category.md', emptyCategory)).toThrow(
      /invalid article schema.*category/i,
    );

    const missingTitle = `---
category: "academics"
updatedDate: 2026-11-17
---

Body text.
`;
    expect(() => parseArticleMarkdown('missing-title.md', missingTitle)).toThrow(
      /invalid article schema.*title/i,
    );
  });

  test('rejects duplicate article slugs across files', () => {
    const validMd = `---
title: "Sample Article"
category: "academics"
updatedDate: 2026-11-17
---

Sample body.
`;
    expect(() =>
      loadArticlesFromRawMap({
        '/a/duplicate.md': validMd,
        '/b/duplicate.md': validMd,
      }),
    ).toThrow(/Duplicate article slug/i);
  });

  test('generates unique GitHub-style heading anchor slugs', () => {
    const seen = new Map<string, number>();
    expect(slugifyHeading('Latin Honors cutoffs and grade floors', seen)).toBe(
      'latin-honors-cutoffs-and-grade-floors',
    );
    expect(slugifyHeading('FAQ', seen)).toBe('faq');
    expect(slugifyHeading('FAQ', seen)).toBe('faq-1');
  });
});
