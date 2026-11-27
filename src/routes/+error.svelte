<script lang="ts">
  import { page } from '$app/state';
  import SearchBar from '#lib/components/SearchBar.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { CATEGORIES, type CategoryMeta } from '../data/categories';

  const siteOrigin = $derived(
    (page.data as { siteOrigin?: string } | undefined)?.siteOrigin ?? page.url.origin,
  );
  const dynamicCategories = $derived(
    (page.data as { categories?: CategoryMeta[] } | undefined)?.categories ?? CATEGORIES,
  );
  const ogImageUrl = $derived(new URL('/og-image.png', siteOrigin).href);
</script>

<SeoHead
  title="Page Not Found - Geary"
  description="The BulSU student article you requested could not be found. Search or browse categories to get back on track."
  {ogImageUrl}
  noindex={true}
/>

<div class="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 text-center">
  <span class="inline-flex items-center rounded-full bg-brand-crimson-wash px-3 py-1 text-xs font-semibold text-brand-crimson">
    404 — Page Not Found
  </span>

  <h1 class="mt-4 font-heading text-[1.75rem] sm:text-[2.25rem] font-bold leading-[1.2] text-ink-primary">
    We couldn't find that article.
  </h1>

  <p class="mt-3 text-base text-ink-secondary">
    The link may have moved or been mistyped. Search for what you need below or jump straight to a student category.
  </p>

  <div class="mt-7">
    <SearchBar variant="hero" enableGlobalShortcut={true} />
  </div>

  <div class="mt-8 rounded-xl border border-border-subtle bg-surface-card p-5 sm:p-6 text-left">
    <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-secondary">
      Browse Student Categories
    </h2>
    <div class="flex flex-wrap gap-2">
      {#each dynamicCategories as category (category.slug)}
        <a
          href={`/categories/${category.slug}`}
          class="inline-flex min-h-[40px] items-center rounded-full border border-border-subtle bg-canvas-paper px-3.5 py-1.5 text-sm font-medium text-ink-primary hover:border-brand-crimson hover:text-brand-crimson transition-colors"
        >
          {category.title}
        </a>
      {/each}
    </div>
  </div>

  <div class="mt-8">
    <a
      href="/"
      class="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-crimson-solid px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
    >
      Back to Home
    </a>
  </div>
</div>
