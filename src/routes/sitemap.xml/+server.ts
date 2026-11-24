import type { RequestHandler } from './$types';
import { CATEGORIES } from '../../data/categories';
import { resolveRequestOrigin } from '#lib/seo';
import { CACHE_CONTROL_HEADER } from '#lib/server/cache';
import { getAllArticles } from '#lib/server/content';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: RequestHandler = ({ url }) => {
  const origin = resolveRequestOrigin(url);
  const articles = getAllArticles();

  const staticPaths = ['/', '/articles', '/calendar', '/map', '/contribute', '/terms', '/privacy'];
  const entries: Array<{ loc: string; lastmod?: string }> = [];

  for (const path of staticPaths) {
    entries.push({ loc: new URL(path, origin).href });
  }

  for (const category of CATEGORIES) {
    entries.push({ loc: new URL(`/categories/${category.slug}`, origin).href });
  }

  for (const article of articles) {
    entries.push({
      loc: new URL(`/articles/${article.slug}`, origin).href,
      lastmod: article.data.updatedDate.toISOString(),
    });
  }

  const urlsXml = entries
    .map((entry) =>
      entry.lastmod
        ? `  <url><loc>${escapeXml(entry.loc)}</loc><lastmod>${escapeXml(entry.lastmod)}</lastmod></url>`
        : `  <url><loc>${escapeXml(entry.loc)}</loc></url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': CACHE_CONTROL_HEADER,
    },
  });
};
