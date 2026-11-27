import type { RequestHandler } from './$types';
import { CACHE_HEADERS } from '#lib/server/cache';
import {
  getAllArticles,
  getDynamicCategories,
  getDynamicCategoryBySlug,
} from '#lib/server/content';
import { slugFromFilePath } from '#lib/server/markdown';
import { resolveArticleSources } from '#lib/articles';

/**
 * Raw `.md` sources keyed by route slug, captured verbatim (frontmatter + body)
 * so the MCP Worker's `get_article` returns content identical to the source files.
 */
const RAW_ARTICLE_FILES = import.meta.glob<string>('/src/content/articles/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const rawBySlug = new Map<string, string>();
for (const [filePath, content] of Object.entries(RAW_ARTICLE_FILES)) {
  rawBySlug.set(slugFromFilePath(filePath), content);
}

export const GET: RequestHandler = () => {
  const articles = getAllArticles().map((article) => {
    const categoryMeta = getDynamicCategoryBySlug(article.data.category);

    return {
      slug: article.slug,
      title: article.data.title,
      category: article.data.category,
      categoryLabel: categoryMeta?.title ?? article.data.category,
      updatedDate: article.data.updatedDate.toISOString(),
      preview: article.preview,
      sources: resolveArticleSources(article.data),
      content: rawBySlug.get(article.slug) ?? article.body,
    };
  });

  return new Response(JSON.stringify({ categories: getDynamicCategories(), articles }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...CACHE_HEADERS,
    },
  });
};
