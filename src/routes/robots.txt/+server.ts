import type { RequestHandler } from './$types';
import { resolveRequestOrigin } from '#lib/seo';
import { CACHE_CONTROL_HEADER } from '#lib/server/cache';

export const GET: RequestHandler = ({ url }) => {
  const baseUrl = resolveRequestOrigin(url);
  const sitemapUrl = new URL('sitemap.xml', baseUrl).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': CACHE_CONTROL_HEADER,
    },
  });
};
