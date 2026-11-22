import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { getCategoryBySlug } from '../data/categories';
import { getArticlePreview, getArticleSlug } from '../lib/articles';
import type { SearchIndexItem } from '../lib/search';

export const GET: APIRoute = async () => {
  const entries = await getCollection('articles');

  const items: SearchIndexItem[] = await Promise.all(
    [...entries]
      .sort((a, b) => a.data.title.localeCompare(b.data.title))
      .map(async (entry) => {
        const { headings } = await render(entry);
        const categoryMeta = getCategoryBySlug(entry.data.category);

        return {
          slug: getArticleSlug(entry),
          title: entry.data.title,
          preview: getArticlePreview(entry),
          category: entry.data.category,
          categoryLabel: categoryMeta?.title ?? entry.data.category,
          subcategory: entry.data.subcategory,
          headings: headings
            .filter((h) => h.depth === 2 || h.depth === 3)
            .map((h) => h.text),
        };
      }),
  );

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
