import { Marked, type Tokens } from 'marked';
import type { CategorySlug } from '../data/categories';

export interface AskIndexChunk {
  id: string;
  text: string;
}

export interface AskIndexItem {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  categoryLabel: string;
  headings: string[];
  /** ISO `YYYY-MM-DD` freshness date from article frontmatter. */
  updatedDate: string;
  /** Canonical article path, e.g. `/articles/<slug>`. */
  url: string;
  chunks: AskIndexChunk[];
}

/** A single retrieved passage sent to `/api/ask`; `n` is its 1-based citation index. */
export interface AskSource {
  n: number;
  slug: string;
  title: string;
  url: string;
  categoryLabel: string;
  updatedDate: string;
  excerpt: string;
  text: string;
}

export const ASK_MAX_SOURCES = 6;
export const ASK_MAX_PER_ARTICLE = 2;
export const ASK_CHUNK_MAX_CHARS = 1400;
export const ASK_NOT_COVERED_SENTINEL = 'NOT_COVERED';

/**
 * Split a Markdown article body into retrievable passages of at most
 * `maxChars` characters. Splitting prefers blank-line (paragraph) boundaries
 * and never drops body text; empty input still yields one chunk.
 */
export function buildAskChunks(body: string, maxChars = ASK_CHUNK_MAX_CHARS): AskIndexChunk[] {
  const limit = Math.max(200, maxChars);
  const sections = body.split(/\n(?=#{1,6}\s)/);
  const packed: string[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;
    if (trimmed.length <= limit) {
      packed.push(trimmed);
      continue;
    }

    const blocks = trimmed.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
    let current = '';
    for (const block of blocks) {
      if (block.length > limit) {
        if (current) {
          packed.push(current);
          current = '';
        }
        for (let i = 0; i < block.length; i += limit) {
          packed.push(block.slice(i, i + limit));
        }
        continue;
      }
      if (current && current.length + block.length + 2 > limit) {
        packed.push(current);
        current = block;
      } else {
        current = current ? `${current}\n\n${block}` : block;
      }
    }
    if (current) packed.push(current);
  }

  const chunks = packed.length > 0 ? packed : [body.trim() || ' '];
  return chunks.map((text, index) => ({ id: `c${index + 1}`, text }));
}

const ASK_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'at',
  'can',
  'do',
  'does',
  'for',
  'from',
  'how',
  'i',
  'in',
  'is',
  'it',
  'my',
  'of',
  'on',
  'or',
  'the',
  'to',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'with',
  'you',
  'your',
]);

function normalizeTokens(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const rawTokens = normalized
    .split(/\s+/)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(Boolean);
  const meaningful = rawTokens.filter((token) => !ASK_STOP_WORDS.has(token));
  return meaningful.length > 0 ? meaningful : rawTokens;
}

/**
 * Retrieve the top-k evidence passages for a question using literal substring
 * matching (never RegExp), consistent with `filterAndRankArticles` weights:
 * every query token must appear somewhere in the article's combined text, then
 * articles are scored `title > headings/subcategory > excerpt`, and each chunk
 * is scored by how many distinct query tokens it contains.
 */
export function retrieveAskSources(
  items: readonly AskIndexItem[],
  rawQuery: string,
  options: { maxSources?: number; maxPerArticle?: number } = {},
): AskSource[] {
  const maxSources = options.maxSources ?? ASK_MAX_SOURCES;
  const maxPerArticle = options.maxPerArticle ?? ASK_MAX_PER_ARTICLE;
  const tokens = normalizeTokens(rawQuery);
  if (tokens.length === 0) return [];

  const normalized = rawQuery.trim().toLowerCase();
  const candidates: Array<{ item: AskIndexItem; chunk: AskIndexChunk; score: number }> = [];

  for (const item of items) {
    const title = item.title.toLowerCase();
    const headingsText = item.headings.join(' ').toLowerCase();
    const excerpt = item.excerpt.toLowerCase();
    const chunkTexts = item.chunks.map((c) => c.text.toLowerCase());
    const articleText = `${title} ${headingsText} ${excerpt} ${chunkTexts.join(' ')}`;

    if (!tokens.every((token) => articleText.includes(token))) {
      continue;
    }

    let metaScore = title.includes(normalized) ? 20 : 0;
    for (const token of tokens) {
      if (title.includes(token)) metaScore += 10;
      if (headingsText.includes(token)) metaScore += 5;
      if (excerpt.includes(token)) metaScore += 2;
    }

    for (const chunk of item.chunks) {
      const chunkText = chunk.text.toLowerCase();
      const chunkHits = tokens.filter((token) => chunkText.includes(token)).length;
      if (chunkHits === 0 && metaScore === 0) continue;
      candidates.push({ item, chunk, score: metaScore + chunkHits * 3 });
    }
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.title.localeCompare(b.item.title);
  });

  const perArticle = new Map<string, number>();
  const selected: typeof candidates = [];
  for (const candidate of candidates) {
    if (selected.length >= maxSources) break;
    const used = perArticle.get(candidate.item.slug) ?? 0;
    if (used >= maxPerArticle) continue;
    perArticle.set(candidate.item.slug, used + 1);
    selected.push(candidate);
  }

  return selected.map((candidate, index) => ({
    n: index + 1,
    slug: candidate.item.slug,
    title: candidate.item.title,
    url: candidate.item.url,
    categoryLabel: candidate.item.categoryLabel,
    updatedDate: candidate.item.updatedDate,
    excerpt: candidate.item.excerpt,
    text: candidate.chunk.text,
  }));
}

/** Whether retrieved evidence is strong enough to justify an answer call. */
export function hasAnswerableEvidence(sources: readonly AskSource[]): boolean {
  return sources.length > 0 && sources.every((source) => source.text.trim().length > 0);
}

const ASK_SYSTEM_PROMPT = [
  'You are the Ask-the-Handbook assistant for Geary, an unofficial Bulacan State University student information hub.',
  'Answer the student\'s question using ONLY the numbered sources provided. Never use outside knowledge, never invent policies, fees, deadlines, offices, or links.',
  'Keep the answer concise, direct, and student-friendly. Use plain English and address the reader as "you".',
  'Format your response using clean Markdown (such as bullet lists, numbered lists, or bold text) when it makes steps or items clearer.',
  'Cite every factual claim inline with only the source number in square brackets, e.g. [1] or [2] (never include dates or titles inside the brackets). Only cite numbers that appear in the source list.',
  'If the sources do not answer the question, reply with exactly NOT_COVERED and nothing else.',
].join('\n');

/** Build the grounded chat messages for the Workers AI model. */
export function buildAskMessages(
  query: string,
  sources: readonly AskSource[],
): Array<{ role: 'system' | 'user'; content: string }> {
  const sourceBlocks = sources
    .map(
      (source) =>
        `[${source.n}] ${source.title} — ${source.categoryLabel} (last updated ${source.updatedDate})\n` +
        `URL: ${source.url}\n` +
        `Summary: ${source.excerpt}\n` +
        `Passage:\n${source.text}`,
    )
    .join('\n\n---\n\n');

  return [
    { role: 'system', content: ASK_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Question: ${query}\n\nSources:\n\n${sourceBlocks}`,
    },
  ];
}

export type AnswerSegment =
  | { type: 'text'; text: string }
  | { type: 'citation'; n: number; url: string; title: string };

/**
 * Parse a raw model answer into renderable segments. Returns `not-covered`
 * when the model emits the NOT_COVERED sentinel; `[n]` markers that match a
 * real source become citation links, everything else stays literal text.
 */
export function parseCitedAnswer(
  raw: string,
  sources: readonly AskSource[],
): { status: 'answered' | 'not-covered'; segments: AnswerSegment[] } {
  const trimmed = raw.trim();
  if (new RegExp(`^${ASK_NOT_COVERED_SENTINEL}\\b`, 'i').test(trimmed)) {
    return { status: 'not-covered', segments: [] };
  }

  const segments: AnswerSegment[] = [];
  const pattern = /\[(\d{1,2})(?:,\s*(?:last\s+updated\b[^\]]*|\d{4}-\d{2}-\d{2}[^\]]*))?\]/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const pushText = (text: string) => {
    if (!text) return;
    const previous = segments[segments.length - 1];
    if (previous?.type === 'text') {
      previous.text += text;
    } else {
      segments.push({ type: 'text', text });
    }
  };

  while ((match = pattern.exec(trimmed)) !== null) {
    pushText(trimmed.slice(lastIndex, match.index));
    const n = Number.parseInt(match[1], 10);
    const source = sources[n - 1];
    if (source) {
      segments.push({ type: 'citation', n, url: source.url, title: source.title });
    } else {
      pushText(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }
  pushText(trimmed.slice(lastIndex));

  return { status: 'answered', segments };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const askMarkdown = new Marked({ gfm: true, breaks: true });
askMarkdown.use({
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }: Tokens.Link) {
      const safeHref =
        href && (href.startsWith('/') || /^https?:\/\//i.test(href))
          ? escapeHtml(href)
          : '#';
      const label = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      const external = /^https?:\/\//i.test(safeHref)
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
      return `<a href="${safeHref}"${titleAttr}${external}>${label}</a>`;
    },
  },
});

/** Render parsed Ask Geary answer segments as sanitized Markdown HTML with inline citation links. */
export function renderAskAnswerHtml(segments: readonly AnswerSegment[]): string {
  const citations = new Map<string, Extract<AnswerSegment, { type: 'citation' }>>();
  let markdown = '';

  segments.forEach((segment, index) => {
    if (segment.type === 'text') {
      markdown += segment.text;
    } else {
      const token = `GEARYCITE${index}TOKEN`;
      citations.set(token, segment);
      markdown += token;
    }
  });

  let html = askMarkdown.parse(markdown, { async: false });
  for (const [token, citation] of citations) {
    const badge = `<a data-citation href="${escapeHtml(citation.url)}" aria-label="Source ${citation.n}: ${escapeHtml(citation.title)}" class="mx-0.5 inline-flex items-center justify-center rounded bg-brand-crimson-wash px-1 py-px align-super text-[0.65rem] font-semibold leading-none text-brand-crimson transition-colors hover:bg-brand-crimson-solid hover:text-white">${citation.n}</a>`;
    html = html.replaceAll(token, badge);
  }

  return html.trim();
}
