import type { RequestHandler } from './$types';
import { CACHE_HEADERS } from '#lib/server/cache';
import { getAllArticles, getDynamicCategoryBySlug } from '#lib/server/content';
import { buildAskChunks, type AskIndexItem } from '#lib/ask';

let cachedAskIndex: AskIndexItem[] | null = null;

/** Serialize the full article corpus into chunked ask-evidence passages (SW-INT-07). */
function buildAskIndex(): AskIndexItem[] {
  if (cachedAskIndex) {
    return cachedAskIndex;
  }

  cachedAskIndex = getAllArticles().map((article) => {
    const categoryMeta = getDynamicCategoryBySlug(article.data.category);

    return {
      slug: article.slug,
      title: article.data.title,
      excerpt: article.preview,
      category: article.data.category,
      categoryLabel: categoryMeta?.title ?? article.data.category,
      headings: article.headings
        .filter((h) => h.depth === 2 || h.depth === 3)
        .map((h) => h.text),
      updatedDate: article.data.updatedDate.toISOString().slice(0, 10),
      url: `/articles/${article.slug}`,
      chunks: buildAskChunks(article.body),
    };
  });

  return cachedAskIndex;
}

export const GET: RequestHandler = () => {
  const items = buildAskIndex();

  return new Response(JSON.stringify(items), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...CACHE_HEADERS,
    },
  });
};
