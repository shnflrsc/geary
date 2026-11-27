import type { CategorySlug } from '../data/categories';

export interface SearchIndexItem {
  slug: string;
  title: string;
  preview: string;
  category: CategorySlug;
  categoryLabel: string;
  headings: string[];
}

/**
 * Score and rank indexed articles against a user search query.
 * Uses literal substring matching (never RegExp) for zero-crash safety.
 */
export function filterAndRankArticles(
  items: readonly SearchIndexItem[],
  rawQuery: string,
  limit = 8,
): SearchIndexItem[] {
  const normalized = rawQuery.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return [];
  }

  const scored: Array<{ item: SearchIndexItem; score: number }> = [];

  for (const item of items) {
    const title = item.title.toLowerCase();
    const headingsText = item.headings.join(' ').toLowerCase();
    const preview = item.preview.toLowerCase();
    const categoryLabel = item.categoryLabel.toLowerCase();
    const combined = `${title} ${headingsText} ${preview} ${categoryLabel}`;

    const matchesAllTokens = tokens.every((token) => combined.includes(token));
    if (!matchesAllTokens) {
      continue;
    }

    let score = title.includes(normalized) ? 20 : 0;

    for (const token of tokens) {
      if (title.includes(token)) {
        score += 10;
      }
      if (headingsText.includes(token)) {
        score += 5;
      }
      if (preview.includes(token) || categoryLabel.includes(token)) {
        score += 2;
      }
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.item.title.localeCompare(b.item.title);
    })
    .slice(0, limit)
    .map((entry) => entry.item);
}
