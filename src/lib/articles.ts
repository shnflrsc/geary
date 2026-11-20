import type { CategorySlug } from '../data/categories';

export interface ArticleSource {
  label: string;
  url?: string;
}

export interface ArticleLike {
  id: string;
  slug?: string;
  body?: string;
  data: {
    title: string;
    category: CategorySlug;
    subcategory: string;
    updatedDate: Date;
    featured: boolean;
    source?: string;
    sourceUrl?: string;
    sources?: readonly ArticleSource[];
  };
}

/** Extract a clean plain-text preview from an article's Markdown body for cards, search, and meta descriptions. */
export function getArticlePreview(
  entry: { body?: string; data: { title: string } },
  maxLength = 160,
): string {
  const raw = entry.body ?? '';
  const plain = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[\s>]*[-*+]\s+/gm, '')
    .replace(/^[\s>]*\d+\.\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) {
    return entry.data.title.trim();
  }
  if (plain.length <= maxLength) {
    return plain;
  }

  const sliced = plain.slice(0, maxLength).trimEnd();
  const lastSpace = sliced.lastIndexOf(' ');
  const cutoff = lastSpace > Math.floor(maxLength * 0.6) ? sliced.slice(0, lastSpace) : sliced;
  return `${cutoff.replace(/[.,;:!?-]+$/, '')}...`;
}

/** Combine legacy `source`/`sourceUrl` and multi-entry `sources` into one deduplicated list. */
export function resolveArticleSources(
  data: Pick<ArticleLike['data'], 'source' | 'sourceUrl' | 'sources'>,
): ArticleSource[] {
  const seen = new Set<string>();
  const resolved: ArticleSource[] = [];

  const pushUnique = (item: ArticleSource) => {
    const label = item.label.trim();
    if (!label) return;
    const url = item.url?.trim() || undefined;
    const key = `${label}\0${url ?? ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    resolved.push(url ? { label, url } : { label });
  };

  if (data.source) {
    pushUnique({ label: data.source, url: data.sourceUrl });
  }
  if (data.sources) {
    for (const item of data.sources) {
      pushUnique(item);
    }
  }

  return resolved;
}

export interface SubcategoryGroup<T extends ArticleLike> {
  subcategory: string;
  articles: T[];
}

/** Resolve the canonical route slug for a Content Layer or legacy collection entry. */
export function getArticleSlug(entry: Pick<ArticleLike, 'id' | 'slug'>): string {
  return (entry.slug ?? entry.id).replace(/\.md$/i, '');
}

/** Format an article updatedDate cleanly for UI cards and article headers. */
export function formatArticleDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Group category articles deterministically by `subcategory` (alphabetical groups,
 * alphabetical article titles inside each group).
 */
export function groupArticlesBySubcategory<T extends ArticleLike>(
  articles: readonly T[],
): SubcategoryGroup<T>[] {
  const buckets = new Map<string, T[]>();

  for (const article of articles) {
    const key = article.data.subcategory.trim();
    const list = buckets.get(key) ?? [];
    list.push(article);
    buckets.set(key, list);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([subcategory, items]) => ({
      subcategory,
      articles: [...items].sort((a, b) => a.data.title.localeCompare(b.data.title)),
    }));
}

/** Return featured articles sorted newest first, then alphabetically by title. */
export function getFeaturedArticles<T extends ArticleLike>(
  articles: readonly T[],
): T[] {
  return articles
    .filter((entry) => entry.data.featured)
    .sort((a, b) => {
      const dateDiff = b.data.updatedDate.getTime() - a.data.updatedDate.getTime();
      return dateDiff !== 0 ? dateDiff : a.data.title.localeCompare(b.data.title);
    });
}

/** Return top preview articles for a Home category card (featured first, then newest). */
export function getCategoryPreviewArticles<T extends ArticleLike>(
  articles: readonly T[],
  category: CategorySlug,
  limit = 3,
): T[] {
  return articles
    .filter((entry) => entry.data.category === category)
    .sort((a, b) => {
      if (a.data.featured !== b.data.featured) {
        return a.data.featured ? -1 : 1;
      }
      const dateDiff = b.data.updatedDate.getTime() - a.data.updatedDate.getTime();
      return dateDiff !== 0 ? dateDiff : a.data.title.localeCompare(b.data.title);
    })
    .slice(0, limit);
}

/** Return up to `limit` sibling articles in the same category, excluding the current slug. */
export function getRelatedArticles<T extends ArticleLike>(
  articles: readonly T[],
  currentSlug: string,
  category: CategorySlug,
  limit = 3,
): T[] {
  return articles
    .filter(
      (entry) =>
        entry.data.category === category && getArticleSlug(entry) !== currentSlug,
    )
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .slice(0, limit);
}

/** Format a local calendar date key (`YYYY-MM-DD`) for deterministic daily rotation. */
export function formatLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Deterministically pick `count` items seeded by `dateKey` (`YYYY-MM-DD`).
 * Incrementing `offset` steps cleanly through non-overlapping batches.
 */
export function pickDailyItems<T>(
  items: readonly T[],
  dateKey: string,
  count = 3,
  offset = 0,
): T[] {
  if (items.length === 0 || count <= 0) return [];
  const take = Math.min(count, items.length);

  let seed = 2166136261;
  for (let i = 0; i < dateKey.length; i += 1) {
    seed ^= dateKey.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  let state = seed >>> 0;
  const nextRand = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRand() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  const safeOffset = ((offset % shuffled.length) + shuffled.length) % shuffled.length;
  const start = (safeOffset * take) % shuffled.length;
  const result: T[] = [];
  for (let i = 0; i < take; i += 1) {
    result.push(shuffled[(start + i) % shuffled.length]);
  }
  return result;
}

/**
 * Partition deterministically randomized daily items into up to `groupCount`
 * non-overlapping groups of `groupSize`, refreshed whenever `dateKey` changes.
 */
export function getDailyItemGroups<T>(
  items: readonly T[],
  dateKey: string,
  groupSize = 6,
  groupCount = 3,
): T[][] {
  if (items.length === 0 || groupSize <= 0 || groupCount <= 0) return [];
  const selected = pickDailyItems(items, dateKey, groupSize * groupCount, 0);
  const groups: T[][] = [];
  for (let start = 0; start < selected.length && groups.length < groupCount; start += groupSize) {
    groups.push(selected.slice(start, start + groupSize));
  }
  return groups;
}
