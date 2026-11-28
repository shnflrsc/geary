<script lang="ts">
  import type { PageProps } from './$types';
  import SearchBar from '#lib/components/SearchBar.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { buildWebsiteJsonLd } from '#lib/seo';

  const { data }: PageProps = $props();

  const quickLinks = [
    { href: '/calendar', label: 'Academic Calendar', icon: 'calendar' },
    { href: '/map', label: 'Campus Map', icon: 'map' },
    { href: '/contribute', label: 'Contribute', icon: 'contribute' },
  ];

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

<section class="relative flex w-full flex-1 items-center px-4 py-20 sm:px-8">
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <picture class="absolute right-[-112px] top-[-112px] md:right-[-210px] md:top-[-210px]">
      <source media="(min-width: 768px)" srcset="/material-3/desktop-crimson-gear.svg" />
      <img class="max-w-none motion-safe:animate-[spin_36s_linear_infinite_reverse]" src="/material-3/mobile-crimson-gear.svg" alt="" />
    </picture>
    <picture class="absolute left-[-112px] bottom-[-112px] md:bottom-[-213px] md:left-[-213px]">
      <source media="(min-width: 768px)" srcset="/material-3/desktop-gold-gear.svg" />
      <img class="max-w-none motion-safe:animate-[spin_36s_linear_infinite]" src="/material-3/mobile-gold-gear.svg" alt="" />
    </picture>
  </div>

  <div class="relative z-10 mx-auto w-full">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="font-heading text-[clamp(1.875rem,8.6vw,2.1875rem)] md:text-[clamp(2.5rem,5vw,4.125rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink-primary">
        The Better BulSU Student Handbook
      </h1>

      <p class="mt-4 text-base sm:text-lg leading-relaxed text-ink-secondary">
        Student-managed information portal for BulSUans, by BulSUans.
      </p>

      <div class="mt-4 sm:mt-8">
        <SearchBar variant="hero" enableGlobalShortcut={true} />
      </div>

      <nav aria-label="Quick links" class="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-2 text-[11px] sm:gap-x-3 sm:text-sm font-medium text-brand-crimson">
        {#each quickLinks as link (link.href)}
          <a href={link.href} class="inline-flex items-center gap-1 hover:underline md:gap-2 md:rounded-lg md:border md:border-border-strong md:px-2.5 md:py-1.5 md:text-ink-primary">
            <span aria-hidden="true" class="hero-link-icon hidden size-[18px] text-brand-crimson md:block" style:--icon={`url('/material-3/${link.icon}-link.svg')`}></span>
            {link.label}
            <span aria-hidden="true" class="hero-link-icon size-3 md:hidden" style:--icon="url('/material-3/up-right.svg')"></span>
          </a>
        {/each}
      </nav>
    </div>

  </div>
</section>

<style>
  .hero-link-icon {
    background-color: currentColor;
    mask: var(--icon) center no-repeat;
  }
</style>
