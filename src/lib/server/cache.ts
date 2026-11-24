/** Shared CDN edge cache policy for Vercel SSR routes and endpoints. */
export const CACHE_CONTROL_HEADER =
  'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';

export const CACHE_HEADERS = {
  'cache-control': CACHE_CONTROL_HEADER,
} as const;
