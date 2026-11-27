<script lang="ts">
  import type { PageProps } from './$types';
  import SearchBar from '#lib/components/SearchBar.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { buildWebsiteJsonLd } from '#lib/seo';

  const { data }: PageProps = $props();

  const HERO_GEARS = [
    {
      className:
        '-right-14 -top-14 h-60 w-60 sm:h-80 sm:w-80 md:top-0 md:bottom-auto md:-translate-y-1/2 md:h-[12rem] md:w-[12rem] md:-right-[6rem] lg:h-[22rem] lg:w-[22rem] lg:-right-[11rem] xl:h-[36rem] xl:w-[36rem] xl:-right-[18rem] 2xl:h-[44rem] 2xl:w-[44rem] 2xl:-right-[22rem] text-brand-crimson/[0.06] motion-safe:animate-[spin_36s_linear_infinite_reverse]',
    },
    {
      className:
        '-left-12 -bottom-16 h-48 w-48 sm:h-64 sm:w-64 md:top-auto md:bottom-0 md:translate-y-1/2 md:h-[12rem] md:w-[12rem] md:-left-[6rem] lg:h-[22rem] lg:w-[22rem] lg:-left-[11rem] xl:h-[36rem] xl:w-[36rem] xl:-left-[18rem] 2xl:h-[44rem] 2xl:w-[44rem] 2xl:-left-[22rem] text-brand-gold/[0.11] motion-safe:animate-[spin_36s_linear_infinite]',
    },
    {
      className:
        'right-[14%] -bottom-12 hidden sm:block md:hidden h-36 w-36 text-brand-gold/[0.09] motion-safe:animate-[spin_44s_linear_infinite_reverse]',
    },
    {
      className:
        'left-[7%] -top-8 hidden sm:block md:hidden h-24 w-24 text-brand-crimson/[0.055] motion-safe:animate-[spin_24s_linear_infinite]',
    },
  ] as const;

  const canonicalUrl = $derived(new URL('/', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
  const websiteJsonLd = $derived(buildWebsiteJsonLd(data.siteOrigin));
</script>

<SeoHead
  title="Geary - The Better BulSU Student Handbook"
  description="Student-managed information portal for BulSUans, by BulSUans."
  {canonicalUrl}
  {ogImageUrl}
  jsonLd={websiteJsonLd}
/>

<section class="relative z-20 flex flex-1 items-center bg-canvas-paper py-6 sm:py-8">
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {#each HERO_GEARS as gear, index (index)}
      <svg viewBox="0 0 200 200" fill="none" class={`absolute ${gear.className}`}>
        <g fill="currentColor">
          <rect x="82" y="10" width="36" height="180" rx="8" />
          <rect x="82" y="10" width="36" height="180" rx="8" transform="rotate(45 100 100)" />
          <rect x="82" y="10" width="36" height="180" rx="8" transform="rotate(90 100 100)" />
          <rect x="82" y="10" width="36" height="180" rx="8" transform="rotate(135 100 100)" />
          <circle cx="100" cy="100" r="64" />
        </g>
        <circle cx="100" cy="100" r="38" fill="var(--color-canvas-paper)" />
      </svg>
    {/each}
  </div>

  <div class="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="font-heading text-[1.875rem] sm:text-[2.5rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink-primary">
        The Better BulSU Student Handbook
      </h1>

      <p class="mt-4 text-base sm:text-lg leading-relaxed text-ink-secondary">
        Student-managed information portal for BulSUans, by BulSUans.
      </p>

      <div class="mt-8 sm:mt-10">
        <SearchBar variant="hero" enableGlobalShortcut={true} />
      </div>

      <nav aria-label="Quick links" class="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-3 text-xs sm:gap-x-6 sm:text-sm font-medium text-brand-crimson">
        <a href="/calendar" class="inline-flex items-baseline gap-1 hover:text-brand-crimson-hover hover:underline underline-offset-2">Academic Calendar <span aria-hidden="true" class="text-[0.85em] opacity-70">↗</span></a>
        <a href="/map" class="inline-flex items-baseline gap-1 hover:text-brand-crimson-hover hover:underline underline-offset-2">Campus Map <span aria-hidden="true" class="text-[0.85em] opacity-70">↗</span></a>
        <a href="/contribute" class="inline-flex items-baseline gap-1 hover:text-brand-crimson-hover hover:underline underline-offset-2">Contribute <span aria-hidden="true" class="text-[0.85em] opacity-70">↗</span></a>
      </nav>
    </div>

  </div>
</section>
