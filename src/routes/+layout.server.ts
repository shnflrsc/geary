import type { LayoutServerLoad } from './$types';
import { requestOrigin } from '#lib/seo-runtime';
import { CACHE_HEADERS } from '#lib/server/cache';
import { getDynamicCategories } from '#lib/server/content';

export const load: LayoutServerLoad = ({ url, setHeaders }) => {
  setHeaders(CACHE_HEADERS);

  return {
    siteOrigin: requestOrigin(url).href,
    categories: getDynamicCategories(),
  };
};
