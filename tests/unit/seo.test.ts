/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildWebsiteJsonLd,
  resolveSiteOrigin,
  serializeJsonLd,
} from '../../src/lib/seo';

describe('SEO JSON-LD builders and safe serialization', () => {
  test('builds WebSite JSON-LD with normalized root URL', () => {
    const schema = buildWebsiteJsonLd('https://geary.example.com');
    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe('Geary');
    expect(schema.url).toBe('https://geary.example.com/');
    expect(schema.inLanguage).toBe('en');
  });

  test('builds ordered BreadcrumbList JSON-LD items', () => {
    const schema = buildBreadcrumbJsonLd([
      { name: 'Home', url: 'https://geary.example.com/' },
      { name: 'Academics', url: 'https://geary.example.com/categories/academics' },
      { name: 'Latin honors' },
    ]);
    const list = schema.itemListElement as Array<Record<string, unknown>>;
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(list).toHaveLength(3);
    expect(list[0].position).toBe(1);
    expect(list[2].position).toBe(3);
    expect(list[2].item).toBeUndefined();
  });

  test('builds Article JSON-LD with ISO modified date and CreativeWork citation', () => {
    const schema = buildArticleJsonLd({
      title: 'Latin honors',
      description: 'GWA ranges and residency requirements.',
      url: 'https://geary.example.com/articles/latin-honors-and-gwa',
      dateModified: new Date('2026-11-18T00:00:00.000Z'),
      section: 'Academics',
      source: 'BulSU Student Manual',
      sourceUrl: 'https://www.bulsu.edu.ph/assets/downloads/files/student_handbook.pdf',
    });

    expect(schema['@type']).toBe('Article');
    expect(schema.dateModified).toBe('2026-11-18T00:00:00.000Z');
    expect(schema.citation).toEqual({
      '@type': 'CreativeWork',
      name: 'BulSU Student Manual',
      url: 'https://www.bulsu.edu.ph/assets/downloads/files/student_handbook.pdf',
    });
  });

  test('builds Article JSON-LD citation array when multiple sources are provided', () => {
    const schema = buildArticleJsonLd({
      title: 'How to Apply to BulSU',
      description: 'ATBulSU steps and requirements.',
      url: 'https://geary.example.com/articles/admission-test-for-bulsu-atbulsu',
      dateModified: new Date('2026-11-18T00:00:00.000Z'),
      section: 'Enrollment',
      sources: [
        {
          label: 'BulSU Freshman Admissions Policy',
          url: 'https://drive.google.com/file/d/16mFYH2WBi2gbmhCntvnljXbUiRUiwJZr/view',
        },
        {
          label: 'BulSU Admissions Office Advisory',
        },
      ],
    });

    expect(schema.citation).toEqual([
      {
        '@type': 'CreativeWork',
        name: 'BulSU Freshman Admissions Policy',
        url: 'https://drive.google.com/file/d/16mFYH2WBi2gbmhCntvnljXbUiRUiwJZr/view',
      },
      'BulSU Admissions Office Advisory',
    ]);
  });

  test('escapes closing script brackets in serialized JSON-LD', () => {
    const raw = serializeJsonLd({ headline: '</script><script>alert(1)</script>' });
    expect(raw).not.toContain('</script>');
    expect(raw).toContain('\\u003c/script>');
  });

  test('resolves canonical site origin from Astro.site, fallback URL, or default', () => {
    expect(resolveSiteOrigin(new URL('https://geary.bulsutools.org/')).href).toBe(
      'https://geary.bulsutools.org/',
    );
    expect(resolveSiteOrigin(undefined, new URL('http://localhost:4321/articles')).href).toBe(
      'http://localhost:4321/',
    );
    expect(resolveSiteOrigin(undefined).href).toBe('https://geary.example.com/');
  });
});
