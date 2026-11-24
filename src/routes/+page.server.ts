import type { PageServerLoad } from './$types';
import { formatLocalDateKey } from '#lib/articles';
import { getAllArticles } from '#lib/server/content';
import type { ExploreItem } from '#lib/components/ExploreSpotlight.svelte';

export const load: PageServerLoad = () => {
  const allArticles = getAllArticles();
  const featuredPool: ExploreItem[] = allArticles.map((entry) => ({
    slug: entry.slug,
    title: entry.data.title,
    preview: entry.preview,
  }));

  return {
    featuredPool,
    initialDateKey: formatLocalDateKey(new Date()),
  };
};
