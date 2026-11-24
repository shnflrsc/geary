import type { LayoutServerLoad } from './$types';
import { resolveRequestOrigin } from '#lib/seo';
import { CACHE_HEADERS } from '#lib/server/cache';

export const load: LayoutServerLoad = ({ url, setHeaders }) => {
  setHeaders(CACHE_HEADERS);

  return {
    siteOrigin: resolveRequestOrigin(url).href,
  };
};
