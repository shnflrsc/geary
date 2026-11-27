<script lang="ts">
  import type { PageProps } from './$types';
  import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
  import CategoryCard from '#lib/components/CategoryCard.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { buildBreadcrumbJsonLd } from '#lib/seo';

  const { data }: PageProps = $props();

  const canonicalUrl = $derived(new URL('/articles', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
  const breadcrumbJsonLd = $derived(
    buildBreadcrumbJsonLd([
      { name: 'Home', url: new URL('/', data.siteOrigin).href },
      { name: 'Articles' },
    ]),
  );
</script>

<SeoHead
  title="Articles - Geary"
  description="Browse all BulSU student articles across enrollment, academics, documents, scholarships, policies, organizations, and campus life."
  {canonicalUrl}
  {ogImageUrl}
  jsonLd={breadcrumbJsonLd}
/>

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
  <div class="mb-8 border-b border-border-subtle pb-6 max-w-3xl">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Articles' },
      ]}
    />

    <h1 class="font-heading text-[1.75rem] sm:text-[2.25rem] font-bold leading-[1.2] tracking-[-0.02em] text-ink-primary">
      Articles
    </h1>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
    {#each data.categories as category (category.slug)}
      <CategoryCard {category} />
    {/each}
  </div>
</div>
