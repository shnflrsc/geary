<script lang="ts">
  import type { PageProps } from './$types';
  import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';

  const { data }: PageProps = $props();

  const FORM_EMBED_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSe3P-px2ZmV6IofZNfWWES9ivfcn4HHjQ5W7c0iTXB_KxXmOw/viewform?embedded=true';
  const FORM_DIRECT_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSe3P-px2ZmV6IofZNfWWES9ivfcn4HHjQ5W7c0iTXB_KxXmOw/viewform';

  const CHECKLIST_ITEMS = [
    'Include an official BulSU source link or reference (Student Manual, Registrar memo, bulsu.edu.ph, or official BulSU Facebook post).',
    'Set Google Docs sharing to Anyone with the link (Viewer) before pasting a draft link.',
    "Expect maintainers to verify facts and edit submissions for clarity into Geary's style before publishing.",
  ];

  const canonicalUrl = $derived(new URL('/contribute', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
</script>

<SeoHead
  title="Contribute - Geary"
  description="Report an outdated BulSU article, submit a student-written draft, or suggest a missing campus topic for Geary."
  {canonicalUrl}
  {ogImageUrl}
/>

<div class="mx-auto max-w-[82rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-16 lg:py-12">
  <div class="mb-8 max-w-[65ch]">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Contribute' },
      ]}
    />

    <h1 class="mt-3 font-heading text-[2rem] md:text-[2.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-ink-primary">
      Contribute to Geary
    </h1>
  </div>

  <div class="max-w-3xl space-y-6">
    <div class="rounded-2xl bg-brand-gold-wash p-5 sm:p-6">
      <h2 class="font-heading text-base font-bold text-brand-gold-ink">Before you submit</h2>
      <ul class="mt-3 space-y-2.5 font-ui text-sm leading-relaxed text-brand-gold-ink">
        {#each CHECKLIST_ITEMS as item (item)}
          <li class="flex items-start gap-2.5">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              class="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-ink"
              stroke="currentColor"
              stroke-width="2.2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.5 8.5 6.5 11.5 12.5 5" />
            </svg>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>

    <section aria-label="Contribution submission form" class="space-y-3">
      <div class="flex justify-end">
        <a
          href={FORM_DIRECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-crimson-wash px-4 font-ui text-sm font-medium text-tonal-content transition-colors hover:brightness-95"
        >
          <span>Open form in a new tab</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div class="overflow-hidden rounded-3xl border border-border-subtle bg-surface-card shadow-geary-1">
        <iframe
          src={FORM_EMBED_URL}
          title="Contribute to Geary Google Form"
          loading="eager"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          referrerpolicy="strict-origin-when-cross-origin"
          class="block h-[700px] sm:h-[640px] w-full border-0"
        >
          Loading submission form...
        </iframe>
      </div>
    </section>
  </div>
</div>
