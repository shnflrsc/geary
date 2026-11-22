import type { APIRoute } from 'astro';
import { resolveSiteOrigin } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = resolveSiteOrigin(site);
  const sitemapUrl = new URL('sitemap-index.xml', baseUrl).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
