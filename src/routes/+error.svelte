<script lang="ts">
  import { page } from '$app/state';
  import SeoHead from '#lib/components/SeoHead.svelte';

  const siteOrigin = $derived(
    (page.data as { siteOrigin?: string } | undefined)?.siteOrigin ?? page.url.origin,
  );
  const ogImageUrl = $derived(new URL('/og-image.png', siteOrigin).href);
  const isNotFound = $derived(page.status === 404);
</script>

<SeoHead
  title={isNotFound ? 'Page Not Found - Geary' : 'Error - Geary'}
  description={isNotFound ? 'The page you requested could not be found.' : 'Something went wrong.'}
  {ogImageUrl}
  noindex={true}
/>

<div class="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 text-center">
  <h1 class="font-heading text-[1.75rem] sm:text-[2.25rem] font-bold leading-[1.2] text-ink-primary">
    {isNotFound ? '404' : page.status}
  </h1>

  <p class="mt-3 text-base text-ink-secondary">
    {isNotFound ? "We couldn't find that page." : 'Something went wrong.'}
  </p>

  <div class="mt-8">
    <a
      href="/"
      class="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-crimson-solid px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
    >
      Back to Home
    </a>
  </div>
</div>
