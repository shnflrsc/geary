import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { buildBreadcrumbJsonLd } from '#lib/seo';
import { requestOrigin } from '#lib/seo-runtime';
import { getAllArticles, getDynamicCategoryBySlug } from '#lib/server/content';

export const load: PageServerLoad = ({ params, url }) => {
  const category = getDynamicCategoryBySlug(params.slug);
  if (!category) {
    error(404, 'Category not found');
  }

  const allArticles = getAllArticles();
  const articles = allArticles
    .filter((entry) => entry.data.category === category.slug)
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .map((article) => ({
      slug: article.slug,
      title: article.data.title,
      preview: article.preview,
    }));

  const baseOrigin = requestOrigin(url);
  const canonicalUrl = new URL(`/categories/${category.slug}`, baseOrigin).href;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: new URL('/', baseOrigin).href },
    { name: 'Articles', url: new URL('/articles', baseOrigin).href },
    { name: category.title },
  ]);

  return {
    activeCategory: category.slug,
    category,
    articles,
    canonicalUrl,
    breadcrumbJsonLd,
  };
};
