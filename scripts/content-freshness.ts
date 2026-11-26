#!/usr/bin/env bun
/**
 * Content freshness audit (bulsutools/geary#3). Report-only: never edits articles.
 *
 * Walks src/content/articles/*.md, collects frontmatter sources
 * (`sourceUrl` + `sources[].url`), flags expiry-prone claims (fees, deadlines,
 * "as of" statements, requirements), fetches each unique source URL, and
 * emits a Markdown report (article x claim x source status).
 *
 * Usage:
 *   bun run freshness                      # print report to stdout
 *   bun run freshness -- --out report.md   # also write report to file
 *   bun run freshness -- --stale-days 180  # override stale threshold
 *
 * The weekly GitHub Action (.github/workflows/content-freshness.yml) runs this
 * and upserts a single rolling "Content freshness report" issue.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';

const REPO_ROOT = resolve(import.meta.dir, '..');
const ARTICLES_DIR = join(REPO_ROOT, 'src/content/articles');
const FETCH_TIMEOUT_MS = 12_000;
const DEFAULT_CONCURRENCY = 6;
const DEFAULT_STALE_DAYS = 90;
const MAX_CLAIMS_PER_ARTICLE = 12;
const MAX_REPORT_CLAIM_ROWS = 200;
const USER_AGENT = 'geary-freshness-audit/0.1 (+https://github.com/bulsutools/geary; report-only)';

type SourceStatus = 'ok' | 'dead' | 'error' | 'unreachable';

interface SourceRef {
  label: string;
  url: string;
}

interface ArticleRecord {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  updatedDate: Date | null;
  ageDays: number | null;
  stale: boolean;
  sources: SourceRef[];
  claims: { excerpt: string; kind: string }[];
}

interface UrlCheck {
  url: string;
  status: SourceStatus;
  httpStatus: number | null;
  finalUrl: string | null;
}

// --- CLI args ---------------------------------------------------------------

function argValue(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? (process.argv[idx + 1] ?? null) : null;
}

const outPath = argValue('--out');
const staleDays = Number(argValue('--stale-days') ?? DEFAULT_STALE_DAYS);
const concurrency = Number(argValue('--concurrency') ?? DEFAULT_CONCURRENCY);

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(
    'Usage: bun run freshness [--out <file>] [--stale-days <n>] [--concurrency <n>]',
  );
  process.exit(0);
}

// --- Frontmatter + claim extraction -----------------------------------------

const CLAIM_PATTERNS: { kind: string; re: RegExp }[] = [
  {
    kind: 'fee',
    re: /₱|PHP\b|\b\d[\d,]*(?:\.\d+)?\s*(?:pesos?|php)\b/i,
  },
  {
    kind: 'deadline',
    re: /\b(?:deadline|due (?:by|date|on)|apply (?:by|before|until|no later than)|submission (?:deadline|date|is due)|cut-?off|last day to)\b/i,
  },
  {
    kind: 'as-of',
    re: /\b(?:as of|effective (?:as of|from|on)|starting (?:on|from|in)|beginning (?:on|from)|from AY|A\.Y\.\s*20\d\d)\b/i,
  },
  {
    kind: 'requirement',
    re: /\b(?:requirements?|must (?:submit|present|bring|have|provide|be|undergo)|documentary|eligib\w+)\b/i,
  },
];

export function splitFrontmatter(raw: string): { fm: string; body: string } | null {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return null;
  return { fm: raw.slice(3, end), body: raw.slice(end + 4) };
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function collectSources(fm: Record<string, unknown>): SourceRef[] {
  const sources: SourceRef[] = [];
  const seen = new Set<string>();
  const push = (label: unknown, url: unknown) => {
    if (typeof url !== 'string' || !url.startsWith('http')) return;
    if (seen.has(url)) return;
    seen.add(url);
    sources.push({ label: typeof label === 'string' ? label : url, url });
  };
  push(fm.source, fm.sourceUrl);
  if (Array.isArray(fm.sources)) {
    for (const entry of fm.sources) {
      if (entry && typeof entry === 'object') {
        const e = entry as Record<string, unknown>;
        push(e.label, e.url);
      }
    }
  }
  return sources;
}

function cleanExcerpt(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractClaims(body: string): { excerpt: string; kind: string }[] {
  const claims: { excerpt: string; kind: string }[] = [];
  const seen = new Set<string>();
  let inFence = false;
  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('```')) inFence = !inFence;
    if (inFence || line.length < 12) continue;
    // Skip pure headings and table separator rows.
    if (/^#{1,6}\s/.test(line) || /^\|?\s*:?-{3,}/.test(line)) continue;
    // Match on link-stripped text so URL fragments (e.g. profile.php) cannot
    // trigger false positives.
    const cleaned = cleanExcerpt(line);
    if (cleaned.length < 12) continue;
    const kind = CLAIM_PATTERNS.find((p) => p.re.test(cleaned))?.kind;
    if (!kind) continue;
    const excerpt = cleaned.slice(0, 160);
    if (seen.has(excerpt)) continue;
    seen.add(excerpt);
    claims.push({ excerpt, kind });
    if (claims.length >= MAX_CLAIMS_PER_ARTICLE) break;
  }
  return claims;
}

function loadArticles(): ArticleRecord[] {
  const now = Date.now();
  return readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = readFileSync(join(ARTICLES_DIR, file), 'utf8');
      const parts = splitFrontmatter(raw);
      const fm = (parts ? (parse(parts.fm) ?? {}) : {}) as Record<string, unknown>;
      const updatedDate = toDate(fm.updatedDate);
      const ageDays = updatedDate
        ? Math.floor((now - updatedDate.getTime()) / 86_400_000)
        : null;
      return {
        slug,
        title: typeof fm.title === 'string' ? fm.title : slug,
        category: typeof fm.category === 'string' ? fm.category : 'unknown',
        subcategory: typeof fm.subcategory === 'string' ? fm.subcategory : 'unknown',
        updatedDate,
        ageDays,
        stale: ageDays !== null && ageDays > staleDays,
        sources: collectSources(fm),
        claims: parts ? extractClaims(parts.body) : [],
      };
    });
}

// --- URL checking -----------------------------------------------------------

async function checkUrl(url: string): Promise<UrlCheck> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,*/*' },
    });
    // Do not consume the body; just record the status.
    await res.body?.cancel().catch(() => {});
    const status: SourceStatus =
      res.status === 404 || res.status === 410
        ? 'dead'
        : res.status >= 200 && res.status < 400
          ? 'ok'
          : 'error';
    return {
      url,
      status,
      httpStatus: res.status,
      finalUrl: res.url && res.url !== url ? res.url : null,
    };
  } catch {
    return { url, status: 'unreachable', httpStatus: null, finalUrl: null };
  }
}

async function checkAll(urls: string[]): Promise<Map<string, UrlCheck>> {
  const results = new Map<string, UrlCheck>();
  let idx = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (idx < urls.length) {
      const url = urls[idx++];
      results.set(url, await checkUrl(url));
    }
  });
  await Promise.all(workers);
  return results;
}

function statusLabel(c: UrlCheck | undefined): string {
  if (!c) return 'not checked';
  if (c.status === 'ok') return `ok (${c.httpStatus})`;
  if (c.status === 'dead') return `DEAD ${c.httpStatus}`;
  if (c.status === 'error') return `error ${c.httpStatus ?? '?'}`;
  return 'unreachable';
}

function articleHealth(article: ArticleRecord, checks: Map<string, UrlCheck>): string {
  const counts = { ok: 0, dead: 0, error: 0, unreachable: 0 };
  for (const s of article.sources) {
    const c = checks.get(s.url);
    if (c) counts[c.status]++;
  }
  const total = article.sources.length;
  const bad = counts.dead + counts.error + counts.unreachable;
  return total === 0
    ? 'no sources'
    : bad === 0
      ? `ok ${counts.ok}/${total}`
      : `${counts.ok} ok / ${counts.dead} dead / ${counts.error} err / ${counts.unreachable} unreach`;
}

// --- Report -----------------------------------------------------------------

function mdCell(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function buildReport(
  articles: ArticleRecord[],
  checks: Map<string, UrlCheck>,
): string {
  const generated = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const lines: string[] = [];

  const allSources = articles.flatMap((a) => a.sources);
  const statusCounts = { ok: 0, dead: 0, error: 0, unreachable: 0 };
  for (const c of checks.values()) statusCounts[c.status]++;
  const totalClaims = articles.reduce((n, a) => n + a.claims.length, 0);
  const articlesWithClaims = articles.filter((a) => a.claims.length > 0).length;
  const staleArticles = articles.filter((a) => a.stale);

  lines.push('# Content freshness report');
  lines.push('');
  lines.push(
    `Generated: ${generated} by \`scripts/content-freshness.ts\` (bulsutools/geary#3). ` +
      'Report-only audit; no article content was modified.',
  );
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Articles scanned: **${articles.length}**`);
  lines.push(`- Unique source URLs checked: **${checks.size}** (${allSources.length} citations)`);
  lines.push(
    `- Source status: **${statusCounts.ok} ok**, **${statusCounts.dead} dead (404/410)**, ` +
      `**${statusCounts.error} HTTP error**, **${statusCounts.unreachable} unreachable**`,
  );
  lines.push(
    `- Expiry-prone claims flagged: **${totalClaims}** across **${articlesWithClaims}** articles ` +
      `(heuristic: fees, deadlines, "as of" statements, requirements)`,
  );
  lines.push(`- Articles stale (> ${staleDays} days since \`updatedDate\`): **${staleArticles.length}**`);
  lines.push('');

  // Broken / failing sources
  const badChecks = [...checks.values()].filter((c) => c.status !== 'ok');
  lines.push(`## Failing sources (${badChecks.length})`);
  lines.push('');
  if (badChecks.length === 0) {
    lines.push('All checked source URLs returned a success status.');
  } else {
    lines.push('| Article | Source label | URL | Status |');
    lines.push('| --- | --- | --- | --- |');
    const urlToArticles = new Map<string, ArticleRecord[]>();
    for (const a of articles) {
      for (const s of a.sources) {
        const list = urlToArticles.get(s.url) ?? [];
        list.push(a);
        urlToArticles.set(s.url, list);
      }
    }
    for (const c of badChecks.sort((x, y) => x.url.localeCompare(y.url))) {
      const citing = urlToArticles.get(c.url) ?? [];
      const articleCell =
        citing.length === 0
          ? '?'
          : citing.map((a) => `\`${a.slug}\``).join('<br>');
      const label = citing[0]?.sources.find((s) => s.url === c.url)?.label ?? '';
      lines.push(
        `| ${articleCell} | ${mdCell(label)} | ${mdCell(c.url)} | ${statusLabel(c)} |`,
      );
    }
  }
  lines.push('');

  // Articles by age
  lines.push(`## Articles by age since \`updatedDate\` (stale threshold: ${staleDays} days)`);
  lines.push('');
  lines.push('| Article | Category | Subcategory | updatedDate | Age (days) | Claims | Source health |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  const byAge = [...articles].sort((a, b) => (b.ageDays ?? -1) - (a.ageDays ?? -1));
  for (const a of byAge.slice(0, 40)) {
    const flag = a.stale ? ' **STALE**' : '';
    lines.push(
      `| \`${a.slug}\`${flag} | ${mdCell(a.category)} | ${mdCell(a.subcategory)} | ` +
        `${a.updatedDate ? a.updatedDate.toISOString().slice(0, 10) : '?'} | ` +
        `${a.ageDays ?? '?'} | ${a.claims.length} | ${articleHealth(a, checks)} |`,
    );
  }
  if (byAge.length > 40) lines.push(`\n_…and ${byAge.length - 40} more articles._`);
  lines.push('');

  // Claims
  lines.push('## Expiry-prone claims');
  lines.push('');
  lines.push('| Article | Claim | Type | Source health |');
  lines.push('| --- | --- | --- | --- |');
  let claimRows = 0;
  let truncated = false;
  for (const a of articles) {
    for (const c of a.claims) {
      if (claimRows >= MAX_REPORT_CLAIM_ROWS) {
        truncated = true;
        break;
      }
      lines.push(
        `| \`${a.slug}\` | ${mdCell(c.excerpt)} | ${c.kind} | ${articleHealth(a, checks)} |`,
      );
      claimRows++;
    }
    if (truncated) break;
  }
  if (truncated) {
    lines.push(`\n_…claim table truncated at ${MAX_REPORT_CLAIM_ROWS} rows._`);
  }
  lines.push('');

  lines.push('## Notes');
  lines.push('');
  lines.push(
    '- "Dead" means HTTP 404/410. "Error" covers other non-2xx/3xx statuses, ' +
      'including bot-blocking (e.g. Facebook/Meta often returns 400/403 to ' +
      'automated checks); verify those manually before editing.',
  );
  lines.push(
    '- Claim detection is heuristic (regex over body text). It surfaces ' +
      'candidates for human review; it does not verify claims against sources.',
  );
  lines.push('- Re-run locally: `bun run freshness`');
  lines.push('');
  return lines.join('\n');
}

// --- Main -------------------------------------------------------------------

if (import.meta.main) {
  const articles = loadArticles();
  const urls = [...new Set(articles.flatMap((a) => a.sources.map((s) => s.url)))];
  const checks = await checkAll(urls);
  const report = buildReport(articles, checks);

  if (outPath) {
    writeFileSync(resolve(process.cwd(), outPath), report + '\n');
    console.error(`Wrote ${outPath}`);
  }
  console.log(report);
}
