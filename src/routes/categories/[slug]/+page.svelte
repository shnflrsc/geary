<script lang="ts">
  import type { PageProps } from './$types';
  import ArticleCard from '#lib/components/ArticleCard.svelte';
  import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';

  const { data }: PageProps = $props();

  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
</script>

<SeoHead
  title={`${data.category.title} - Geary`}
  description={data.category.description}
  canonicalUrl={data.canonicalUrl}
  {ogImageUrl}
  jsonLd={data.breadcrumbJsonLd}
/>

<div class="mx-auto max-w-[82rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
  <div class="mb-10 border-b border-border-subtle pb-6 max-w-3xl">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Articles', href: '/articles' },
        { label: data.category.title },
      ]}
    />

    <h1 class="font-heading text-[1.75rem] sm:text-[2.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-ink-primary">
      {data.category.title}
    </h1>
  </div>

  {#if data.articles.length > 0}
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {#each data.articles as article (article.slug)}
        <ArticleCard {article} categoryLabel={data.category.title} />
      {/each}
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center py-14 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class="h-8 w-8 text-ink-muted"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
      <p class="mt-3 text-sm font-medium text-ink-secondary">
        No articles here yet.
      </p>
    </div>
  {/if}
</div>
