import type { PageServerLoad } from './$types';
import { getAllArticles } from '#lib/server/content';

export const load: PageServerLoad = () => ({
  articles: getAllArticles()
    .map(({ slug, data, preview }) => ({
      slug,
      title: data.title,
      category: data.category,
      preview,
    }))
    .sort((a, b) => a.title.localeCompare(b.title)),
});
