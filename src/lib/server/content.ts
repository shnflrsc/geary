import {
  buildSearchIndex,
  loadArticlesFromRawMap,
  type ParsedArticle,
} from './markdown';
import type { SearchIndexItem } from '../search';

const RAW_ARTICLE_FILES = import.meta.glob<string>('/src/content/articles/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

let cachedArticles: ParsedArticle[] | null = null;
let cachedSearchIndex: SearchIndexItem[] | null = null;

/** Return all validated, compiled Markdown articles sorted deterministically by title. */
export function getAllArticles(): ParsedArticle[] {
  if (!cachedArticles) {
    cachedArticles = loadArticlesFromRawMap(RAW_ARTICLE_FILES);
  }
  return cachedArticles;
}

/** Resolve a single compiled article by slug, or undefined if not found. */
export function getArticleBySlug(slug: string): ParsedArticle | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

/** Return the serialized client search index for all published articles. */
export function getSearchIndex(): SearchIndexItem[] {
  if (!cachedSearchIndex) {
    cachedSearchIndex = buildSearchIndex(getAllArticles());
  }
  return cachedSearchIndex;
}
