<script lang="ts">
  import type { PageProps } from './$types';
  import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
  import ArticleCard from '#lib/components/ArticleCard.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { buildBreadcrumbJsonLd } from '#lib/seo';

  const { data }: PageProps = $props();

  let category = $state('');
  const labels = $derived(new Map(data.categories.map((item) => [item.slug, item.title])));
  const articles = $derived(category
    ? data.articles.filter((article) => article.category === category)
    : data.articles);
  const filters = $derived([{ slug: '', title: 'All articles' }, ...data.categories]);

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

<div class="mx-auto max-w-[82rem] px-4 py-6 sm:px-8 lg:px-16">
  <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Articles' }]} />
  <h1 class="font-heading text-[2rem] font-bold tracking-tight md:text-[2.5rem]">Articles</h1>

  <div role="group" aria-label="Filter articles by category" class="mt-4 flex flex-wrap gap-2 border-b border-border-subtle pb-5 font-ui">
    {#each filters as filter (filter.slug)}
      <button
        type="button"
        aria-pressed={category === filter.slug}
        onclick={() => { category = filter.slug; }}
        class={`min-h-9 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-surface-subtle ${category === filter.slug
          ? 'border-transparent bg-brand-crimson-wash text-tonal-content'
          : 'border-border-strong bg-surface-card text-ink-secondary'}`}
      >
        {#if category === filter.slug}<span aria-hidden="true" class="mr-1">✓</span>{/if}
        {filter.title}
      </button>
    {/each}
  </div>

  <section aria-labelledby="article-list-heading" class="mt-6">
    <h2 id="article-list-heading" class="mb-4 font-heading text-xl font-bold">
      {labels.get(category) ?? 'All articles'}
    </h2>
    <p class="sr-only" role="status">{articles.length} {articles.length === 1 ? 'article' : 'articles'}</p>
    {#if articles.length}
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {#each articles as article (article.slug)}
          <ArticleCard {article} categoryLabel={labels.get(article.category)} />
        {/each}
      </div>
    {:else}
      <p class="rounded-2xl bg-surface-card p-5 text-ink-secondary">No articles here yet.</p>
    {/if}
  </section>
</div>
