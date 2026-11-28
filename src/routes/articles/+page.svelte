<script lang="ts">
  import type { PageProps } from './$types';
  import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { filterAndRankArticles } from '#lib/search';
  import { buildBreadcrumbJsonLd } from '#lib/seo';

  const { data }: PageProps = $props();
  let query = $state('');
  let category = $state('all');

  const filteredArticles = $derived.by(() => {
    const matches = query.trim()
      ? new Set(filterAndRankArticles(data.articles, query, data.articles.length).map((article) => article.slug))
      : null;
    return data.articles
      .filter((article) => (category === 'all' || article.category === category) && (!matches || matches.has(article.slug)))
      .sort((a, b) => b.updatedDate.localeCompare(a.updatedDate) || a.title.localeCompare(b.title));
  });

  const canonicalUrl = $derived(new URL('/articles', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
  const breadcrumbJsonLd = $derived(buildBreadcrumbJsonLd([
    { name: 'Home', url: new URL('/', data.siteOrigin).href },
    { name: 'Articles' },
  ]));
</script>

<SeoHead
  title="Articles - Geary"
  description="Browse all BulSU student articles across enrollment, academics, documents, scholarships, policies, organizations, and campus life."
  {canonicalUrl}
  {ogImageUrl}
  jsonLd={breadcrumbJsonLd}
/>

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
  <div class="mb-8 max-w-3xl border-b border-border-subtle pb-6">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Articles' }]} />
    <h1 class="font-heading text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] text-ink-primary sm:text-[2.25rem]">Articles</h1>
  </div>

  <div class="flex flex-col gap-3 sm:flex-row">
    <label class="relative min-w-0 flex-1">
      <span class="sr-only">Search articles</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input type="search" bind:value={query} placeholder="Search articles..." class="h-11 w-full rounded-lg border border-border-strong bg-surface-card pr-4 pl-10 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20" />
    </label>
  </div>

  <div class="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
    <button type="button" aria-pressed={category === 'all'} onclick={() => category = 'all'} class={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${category === 'all' ? 'border-brand-crimson bg-brand-crimson-wash text-brand-crimson' : 'border-border-subtle bg-surface-card text-ink-secondary hover:border-brand-crimson'}`}>All</button>
    {#each data.categories as item (item.slug)}
      <button type="button" aria-pressed={category === item.slug} onclick={() => category = item.slug} class={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${category === item.slug ? 'border-brand-crimson bg-brand-crimson-wash text-brand-crimson' : 'border-border-subtle bg-surface-card text-ink-secondary hover:border-brand-crimson'}`}>{item.title}</button>
    {/each}
  </div>

  {#if filteredArticles.length}
    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each filteredArticles as article (article.slug)}
        <a href={`/articles/${article.slug}`} class="group flex flex-col rounded-xl border border-border-subtle bg-surface-card p-5 transition-colors hover:border-brand-crimson focus-visible:outline-2 focus-visible:outline-brand-crimson">
          <span class="mb-2 text-xs font-semibold text-brand-crimson">{article.categoryLabel}</span>
          <h2 class="font-heading text-base font-semibold leading-snug text-ink-primary group-hover:text-brand-crimson">{article.title}</h2>
          <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-secondary">{article.preview}</p>
        </a>
      {/each}
    </div>
  {:else}
    <div class="mt-6 rounded-xl border border-border-subtle bg-surface-card px-5 py-12 text-center">
      <p class="text-sm text-ink-secondary">No articles match your search and filters.</p>
      <button type="button" onclick={() => { query = ''; category = 'all'; }} class="mt-3 text-sm font-semibold text-brand-crimson hover:underline focus-visible:outline-2 focus-visible:outline-brand-crimson">Clear search and filters</button>
    </div>
  {/if}
</div>
