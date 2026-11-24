import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryBySlug } from '../../../data/categories';
import { formatArticleDate, resolveArticleSources } from '#lib/articles';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, resolveRequestOrigin } from '#lib/seo';
import { getArticleBySlug } from '#lib/server/content';

export const load: PageServerLoad = ({ params, url }) => {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    error(404, 'Article not found');
  }

  const categoryMeta = getCategoryBySlug(article.data.category);
  if (!categoryMeta) {
    error(500, `Unknown category slug: ${article.data.category}`);
  }

  const baseOrigin = resolveRequestOrigin(url);
  const articleUrl = new URL(`/articles/${article.slug}`, baseOrigin).href;
  const resolvedSources = resolveArticleSources(article.data);

  const jsonLd = [
    buildArticleJsonLd({
      title: article.data.title,
      description: article.preview,
      url: articleUrl,
      dateModified: article.data.updatedDate,
      section: categoryMeta.title,
      source: article.data.source,
      sourceUrl: article.data.sourceUrl,
      sources: article.data.sources,
    }),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: new URL('/', baseOrigin).href },
      { name: 'Articles', url: new URL('/articles', baseOrigin).href },
      {
        name: categoryMeta.title,
        url: new URL(`/categories/${categoryMeta.slug}`, baseOrigin).href,
      },
      { name: article.data.title },
    ]),
  ];

  return {
    activeCategory: categoryMeta.slug,
    title: article.data.title,
    preview: article.preview,
    subcategory: article.data.subcategory,
    modifiedTime: article.data.updatedDate.toISOString(),
    formattedDate: formatArticleDate(article.data.updatedDate),
    articleUrl,
    categoryMeta,
    headings: article.headings,
    html: article.html,
    sources: resolvedSources,
    jsonLd,
  };
};
