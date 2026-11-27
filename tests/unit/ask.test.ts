/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
  ASK_CHUNK_MAX_CHARS,
  buildAskChunks,
  buildAskMessages,
  hasAnswerableEvidence,
  parseCitedAnswer,
  renderAskAnswerHtml,
  retrieveAskSources,
  type AskIndexItem,
  type AskSource,
} from '../../src/lib/ask';

function makeItem(overrides: Partial<AskIndexItem> = {}): AskIndexItem {
  return {
    slug: 'sample-article',
    title: 'Sample Article',
    excerpt: 'A short excerpt about the topic.',
    category: 'documents',
    categoryLabel: 'Documents',
    headings: ['Step-by-Step Workflow'],
    updatedDate: '2026-11-17',
    url: '/articles/sample-article',
    chunks: [{ id: 'c1', text: 'Body passage about transcripts and requests.' }],
    ...overrides,
  };
}

const FIXTURE_ITEMS: AskIndexItem[] = [
  makeItem({
    slug: 'complete-guide-to-scholarships-at-bulsu',
    title: 'Complete Guide to Scholarships at BulSU',
    excerpt:
      'Scholarship types, eligibility rules, and how to apply for financial assistance.',
    category: 'scholarships',
    categoryLabel: 'Scholarships',
    headings: ['How to Apply', 'Required Documents'],
    updatedDate: '2026-10-05',
    url: '/articles/complete-guide-to-scholarships-at-bulsu',
    chunks: [
      {
        id: 'c1',
        text: '## How to Apply\n\nSubmit the scholarship application form to the OSAS window before the deadline.',
      },
      {
        id: 'c2',
        text: '## Required Documents\n\nPrepare your birth certificate, latest transcript, and certificate of registration.',
      },
    ],
  }),
  makeItem({
    slug: 'how-to-request-transcript-and-certificates',
    title: 'How to Request Transcript and Certificates',
    excerpt: 'TOR, COG, and Good Moral request steps at the Registrar.',
    category: 'documents',
    categoryLabel: 'Documents',
    headings: ['Step-by-Step Request Workflow'],
    updatedDate: '2026-09-20',
    url: '/articles/how-to-request-transcript-and-certificates',
    chunks: [
      {
        id: 'c1',
        text: 'Request a transcript of records at the Office of the University Registrar with your student ID.',
      },
    ],
  }),
  makeItem({
    slug: 'bulsu-library-guide',
    title: 'BulSU Library Guide',
    excerpt: 'e-Library access, Turnitin, and borrowing rules.',
    category: 'campus',
    categoryLabel: 'Campus',
    headings: ['e-Library and Turnitin'],
    updatedDate: '2026-08-11',
    url: '/articles/bulsu-library-guide',
    chunks: [{ id: 'c1', text: 'Borrow books at the library counter using your student ID.' }],
  }),
];

describe('buildAskChunks', () => {
  test('keeps short bodies as a single chunk', () => {
    const chunks = buildAskChunks('## Intro\n\nShort body.');
    expect(chunks).toHaveLength(1);
    expect(chunks[0].text).toContain('Short body.');
  });

  test('splits long bodies into bounded passages without dropping text', () => {
    const paragraph = 'a'.repeat(300);
    const body = Array.from({ length: 12 }, (_, i) => `## Section ${i}\n\n${paragraph}`).join('\n\n');
    const chunks = buildAskChunks(body, 500);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(ASK_CHUNK_MAX_CHARS + 200);
    }
    const joined = chunks.map((c) => c.text).join('\n');
    for (let i = 0; i < 12; i += 1) {
      expect(joined).toContain(`Section ${i}`);
    }
  });

  test('handles empty body', () => {
    const chunks = buildAskChunks('   ');
    expect(chunks).toHaveLength(1);
    expect(chunks[0].text.trim()).toBe('');
  });
});

describe('retrieveAskSources', () => {
  test('ranks the scholarship guide first for a scholarship question', () => {
    const sources = retrieveAskSources(
      FIXTURE_ITEMS,
      'how do I apply for a scholarship',
    );
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0].slug).toBe('complete-guide-to-scholarships-at-bulsu');
    expect(sources[0].n).toBe(1);
    expect(sources[0].url).toBe('/articles/complete-guide-to-scholarships-at-bulsu');
    expect(sources[0].updatedDate).toBe('2026-10-05');
  });

  test('returns document guide for transcript question', () => {
    const sources = retrieveAskSources(
      FIXTURE_ITEMS,
      'how do I request a transcript of records',
    );
    expect(sources[0]?.slug).toBe('how-to-request-transcript-and-certificates');
  });

  test('strips punctuation and question stop words from natural queries', () => {
    const sources = retrieveAskSources(
      FIXTURE_ITEMS,
      'Where can I apply for a scholarship?',
    );
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0]?.slug).toBe('complete-guide-to-scholarships-at-bulsu');
  });

  test('returns empty for unrelated or whitespace queries', () => {
    expect(retrieveAskSources(FIXTURE_ITEMS, 'zzzz quantum physics nebula')).toEqual([]);
    expect(retrieveAskSources(FIXTURE_ITEMS, '   ')).toEqual([]);
  });

  test('caps sources and per-article chunks', () => {
    const manyChunks = Array.from({ length: 8 }, (_, i) => ({
      id: `c${i}`,
      text: `Scholarship application step ${i} details.`,
    }));
    const items = [
      makeItem({
        slug: 'scholarship-heavy',
        title: 'Scholarship Application Deep Dive',
        excerpt: 'Scholarship application guidance.',
        chunks: manyChunks,
      }),
      ...FIXTURE_ITEMS,
    ];
    const sources = retrieveAskSources(items, 'scholarship application', {
      maxSources: 6,
      maxPerArticle: 2,
    });
    expect(sources.length).toBeLessThanOrEqual(6);
    const heavyCount = sources.filter((s) => s.slug === 'scholarship-heavy').length;
    expect(heavyCount).toBeLessThanOrEqual(2);
    sources.forEach((source, index) => expect(source.n).toBe(index + 1));
  });
});

describe('hasAnswerableEvidence', () => {
  test('requires at least one non-empty source', () => {
    expect(hasAnswerableEvidence([])).toBe(false);
    const source = retrieveAskSources(FIXTURE_ITEMS, 'scholarship')[0];
    expect(hasAnswerableEvidence([source])).toBe(true);
  });
});

describe('buildAskMessages', () => {
  test('embeds numbered sources with updatedDate and citation instructions', () => {
    const sources = retrieveAskSources(FIXTURE_ITEMS, 'scholarship application');
    const messages = buildAskMessages('how do I apply for a scholarship', sources);
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('system');
    expect(messages[0].content).toContain('ONLY the numbered sources');
    expect(messages[0].content).toContain('NOT_COVERED');
    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toContain('[1] Complete Guide to Scholarships at BulSU');
    expect(messages[1].content).toContain('last updated 2026-10-05');
    expect(messages[1].content).toContain('how do I apply for a scholarship');
  });
});

describe('parseCitedAnswer', () => {
  const sources: AskSource[] = [
    {
      n: 1,
      slug: 'a',
      title: 'Article A',
      url: '/articles/a',
      categoryLabel: 'Documents',
      updatedDate: '2026-01-01',
      excerpt: 'Excerpt',
      text: 'Text',
    },
    {
      n: 2,
      slug: 'b',
      title: 'Article B',
      url: '/articles/b',
      categoryLabel: 'Academics',
      updatedDate: '2026-02-02',
      excerpt: 'Excerpt',
      text: 'Text',
    },
  ];

  test('detects NOT_COVERED sentinel', () => {
    const parsed = parseCitedAnswer('NOT_COVERED', sources);
    expect(parsed.status).toBe('not-covered');
    expect(parsed.segments).toEqual([]);
    expect(parseCitedAnswer('I could not find that.', sources).status).toBe('answered');
    expect(parseCitedAnswer('NOT_COVERED: sorry', sources).status).toBe('not-covered');
  });

  test('converts valid [n] markers to citations and keeps invalid ones literal', () => {
    const parsed = parseCitedAnswer(
      'Apply online [1], then submit forms [2] and check [9].',
      sources,
    );
    expect(parsed.status).toBe('answered');
    const citations = parsed.segments.filter((s) => s.type === 'citation');
    expect(citations).toEqual([
      { type: 'citation', n: 1, url: '/articles/a', title: 'Article A' },
      { type: 'citation', n: 2, url: '/articles/b', title: 'Article B' },
    ]);
    const text = parsed.segments
      .filter((s) => s.type === 'text')
      .map((s) => s.text)
      .join('');
    expect(text).toContain('[9]');
    expect(text).not.toContain('[1]');
  });

  test('strips inline last updated dates from citation markers', () => {
    const parsed = parseCitedAnswer(
      'Check fees [1, last updated 2026-11-25] and dates [2, 2026-02-02].',
      sources,
    );
    expect(parsed.status).toBe('answered');
    const citations = parsed.segments.filter((s) => s.type === 'citation');
    expect(citations).toEqual([
      { type: 'citation', n: 1, url: '/articles/a', title: 'Article A' },
      { type: 'citation', n: 2, url: '/articles/b', title: 'Article B' },
    ]);
  });

  test('escapes nothing but preserves plain text safely', () => {
    const parsed = parseCitedAnswer('Use <b>bold</b> safely [1].', sources);
    const text = parsed.segments
      .filter((s) => s.type === 'text')
      .map((s) => s.text)
      .join('');
    expect(text).toContain('<b>bold</b>');
  });
});

describe('renderAskAnswerHtml', () => {
  const sources: AskSource[] = [
    {
      n: 1,
      slug: 'a',
      title: 'Article A',
      url: '/articles/a',
      categoryLabel: 'Academics',
      updatedDate: '2026-01-01',
      excerpt: 'Excerpt A',
      text: 'Passage A',
    },
  ];

  test('renders markdown lists, bold text, and inline citation links while escaping raw HTML', () => {
    const parsed = parseCitedAnswer(
      'Steps:\n\n1. **Submit** form [1]\n- Keep receipt\n\n<script>alert(1)</script>',
      sources,
    );
    const html = renderAskAnswerHtml(parsed.segments);
    expect(html).toContain('<ol>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<strong>Submit</strong>');
    expect(html).toContain('href="/articles/a"');
    expect(html).toContain('data-citation');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
});
