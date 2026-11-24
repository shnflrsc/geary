import type { RequestHandler } from './$types';
import { CACHE_CONTROL_HEADER } from '#lib/server/cache';
import { getSearchIndex } from '#lib/server/content';

export const GET: RequestHandler = () => {
  const items = getSearchIndex();

  return new Response(JSON.stringify(items), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': CACHE_CONTROL_HEADER,
    },
  });
};
