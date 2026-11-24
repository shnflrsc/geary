<script lang="ts">
  import type { PageProps } from './$types';
  import CampusMap from '#lib/components/CampusMap.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';

  const { data }: PageProps = $props();

  const canonicalUrl = $derived(new URL('/map', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
</script>

<SeoHead
  title="Main Campus - Geary"
  description="Interactive 2D map of Bulacan State University Malolos Main Campus. Search offices, clinics, libraries, and student facilities to see which building they are in."
  {canonicalUrl}
  {ogImageUrl}
/>

<h1 class="sr-only">Main Campus</h1>
<CampusMap />
