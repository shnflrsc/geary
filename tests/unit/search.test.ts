/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { filterAndRankArticles, type SearchIndexItem } from '../../src/lib/search';
import { buildSearchIndex, loadArticlesFromRawMap } from '../../src/lib/server/markdown';

const FIXTURE_ITEMS: SearchIndexItem[] = [
  {
    slug: 'how-to-complete-inc',
    title: 'How to Complete an INC Grade',
    preview:
      'Completion period deadlines, Completion Form routing, and Registrar submission steps.',
    category: 'documents',
    categoryLabel: 'Registrar & Documents',
    headings: ['Step-by-Step INC Grade Completion', 'Checking Your Updated Portal Record'],
  },
  {
    slug: 'latin-honors-and-gwa',
    title: 'Latin Honors & GWA Requirements',
    preview:
      'Simplified breakdown of BulSU GWA brackets, residency minimums, and grade disqualifiers.',
    category: 'academics',
    categoryLabel: 'Handbook & Policies',
    headings: [
      'Latin Honors GWA Brackets',
      'Common Disqualifiers to Watch Out For',
      'How GWA Is Calculated',
    ],
  },
  {
    slug: 'how-to-request-tor',
    title: 'How to Request a Transcript of Records (TOR)',
    preview:
      'Window flow, clearance prerequisites, estimated fees, and claiming tips at BulSU.',
    category: 'documents',
    categoryLabel: 'Registrar & Documents',
    headings: ['What to Bring Before Lining Up', 'Step-by-Step Request Workflow'],
  },
  {
    slug: 'inc-note-in-preview',
    title: 'General Academic Standing Overview',
    preview: 'Includes a brief mention of INC grading rules and honors review.',
    category: 'academics',
    categoryLabel: 'Handbook & Policies',
    headings: ['Overview'],
  },
  {
    slug: 'special-char-test',
    title: 'Marking [INC] (2026)*?\\+ Rules',
    preview: 'Testing literal character matching for GWA > 1.75 thresholds.',
    category: 'academics',
    categoryLabel: 'Handbook & Policies',
    headings: ['Edge Cases'],
  },
];

describe('Search query normalization & weighted ranking (TC-UNIT-01..03)', () => {
  test('TC-UNIT-01: normalizes multi-term queries and weights title > headings/subcategory > preview', () => {
    const torResults = filterAndRankArticles(FIXTURE_ITEMS, '  tor  ');
    expect(torResults[0]?.slug).toBe('how-to-request-tor');

    const incResults = filterAndRankArticles(FIXTURE_ITEMS, 'inc');
    expect(incResults.length).toBeGreaterThanOrEqual(2);
    // Exact title matches outrank preview-only match
    expect(incResults[incResults.length - 1]?.slug).toBe('inc-note-in-preview');

    const multiTerm = filterAndRankArticles(FIXTURE_ITEMS, 'latin honors');
    expect(multiTerm[0]?.slug).toBe('latin-honors-and-gwa');
  });

  test('TC-UNIT-01: caps results at limit=8 and filters 200 items in under 16ms', () => {
    const largeCorpus: SearchIndexItem[] = Array.from({ length: 200 }, (_, i) => ({
      slug: `guide-${i}`,
      title: `BulSU Guide ${i} Enrollment`,
      preview: 'Guide body preview for student procedures and forms.',
      category: 'enrollment',
      categoryLabel: 'Admissions & Enrollment',
      headings: ['Requirements', 'Steps'],
    }));

    const start = performance.now();
    const results = filterAndRankArticles(largeCorpus, 'guide enrollment');
    const elapsedMs = performance.now() - start;

    expect(results.length).toBe(8);
    expect(elapsedMs).toBeLessThan(16);
  });

  test('TC-UNIT-02: treats regex metacharacters and XSS-like strings as safe literal substrings', () => {
    expect(() => filterAndRankArticles(FIXTURE_ITEMS, '[INC] (2026)*?\\+')).not.toThrow();
    const literalMatch = filterAndRankArticles(FIXTURE_ITEMS, '[INC] (2026)*?\\+');
    expect(literalMatch[0]?.slug).toBe('special-char-test');

    const gtMatch = filterAndRankArticles(FIXTURE_ITEMS, 'GWA > 1.75');
    expect(gtMatch[0]?.slug).toBe('special-char-test');

    expect(() =>
      filterAndRankArticles(FIXTURE_ITEMS, '<script>alert(1)</script>'),
    ).not.toThrow();
    expect(filterAndRankArticles(FIXTURE_ITEMS, '<script>alert(1)</script>')).toEqual([]);
  });

  test('TC-UNIT-03: returns empty array for empty or whitespace-only queries', () => {
    expect(filterAndRankArticles(FIXTURE_ITEMS, '')).toEqual([]);
    expect(filterAndRankArticles(FIXTURE_ITEMS, '   ')).toEqual([]);
    expect(filterAndRankArticles(FIXTURE_ITEMS, '\t\n  ')).toEqual([]);
  });
});

describe('Pure buildSearchIndex() schema contract (TC-UNIT-05)', () => {
  test('TC-UNIT-05: buildSearchIndex() conforms to SearchIndexItem schema and stays < 100 KB', () => {
    const articlesDir = resolve(process.cwd(), 'src/content/articles');
    const mdFiles = readdirSync(articlesDir).filter((file) => file.endsWith('.md'));
    const rawMap: Record<string, string> = {};
    for (const file of mdFiles) {
      const fullPath = resolve(articlesDir, file);
      rawMap[fullPath] = readFileSync(fullPath, 'utf-8');
    }

    const articles = loadArticlesFromRawMap(rawMap);
    const indexItems = buildSearchIndex(articles);
    const serialized = JSON.stringify(indexItems);
    const byteSize = Buffer.byteLength(serialized, 'utf-8');

    expect(indexItems.length).toBe(mdFiles.length);
    expect(byteSize).toBeGreaterThan(0);
    expect(byteSize).toBeLessThan(100 * 1024);

    const itemSchema = z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      preview: z.string().min(1),
      category: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
      categoryLabel: z.string().min(1),
      headings: z.array(z.string().min(1)),
    });

    const validation = z.array(itemSchema).min(1).safeParse(indexItems);
    expect(validation.success).toBe(true);
  });
});
