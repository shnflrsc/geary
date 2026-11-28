import type { PageServerLoad } from './$types';
import { getAllArticles, getSearchIndex } from '#lib/server/content';

export const load: PageServerLoad = () => {
  const dates = new Map(getAllArticles().map((article) => [article.slug, article.data.updatedDate.toISOString()]));
  return {
    articles: getSearchIndex().map((article) => ({ ...article, updatedDate: dates.get(article.slug) ?? '' })),
  };
};
