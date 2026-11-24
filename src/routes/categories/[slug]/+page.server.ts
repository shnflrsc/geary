import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryBySlug } from '../../../data/categories';
import { groupArticlesBySubcategory } from '#lib/articles';
import { buildBreadcrumbJsonLd, resolveRequestOrigin } from '#lib/seo';
import { getAllArticles } from '#lib/server/content';

export const load: PageServerLoad = ({ params, url }) => {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    error(404, 'Category not found');
  }

  const allArticles = getAllArticles();
  const categoryArticles = allArticles.filter((entry) => entry.data.category === category.slug);
  const grouped = groupArticlesBySubcategory(categoryArticles).map((group) => ({
    subcategory: group.subcategory,
    articles: group.articles.map((article) => ({
      slug: article.slug,
      title: article.data.title,
      preview: article.preview,
    })),
  }));

  const baseOrigin = resolveRequestOrigin(url);
  const canonicalUrl = new URL(`/categories/${category.slug}`, baseOrigin).href;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: new URL('/', baseOrigin).href },
    { name: 'Articles', url: new URL('/articles', baseOrigin).href },
    { name: category.title },
  ]);

  return {
    activeCategory: category.slug,
    category,
    subcategoryGroups: grouped,
    canonicalUrl,
    breadcrumbJsonLd,
  };
};
