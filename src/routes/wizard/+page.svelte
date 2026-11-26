<script lang="ts">
  import type { PageProps } from './$types';
  import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
  import ClearanceWizard from '#lib/components/ClearanceWizard.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';

  const { data }: PageProps = $props();

  const canonicalUrl = $derived(new URL('/wizard', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
</script>

<SeoHead
  title="Document Request Wizard - Geary"
  description="Pick a BulSU document request and check off the requirements, fees, office, and processing time as you gather them."
  {canonicalUrl}
  {ogImageUrl}
/>

<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
  <div class="mb-8 border-b border-border-subtle pb-6">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Articles', href: '/articles' },
        { label: 'Document Request Wizard' },
      ]}
    />

    <h1
      class="font-heading text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] text-ink-primary sm:text-[2.25rem]"
    >
      Document Request Wizard
    </h1>
    <p class="mt-3 text-sm leading-relaxed text-ink-secondary sm:text-base">
      Pick what you are requesting (such as a transcript, certificate, ID
      replacement, or credential) and check off each requirement as you gather it.
      Every checklist comes straight from Geary's verified guides; fees and
      processing times are unofficial summaries, so confirm details with the
      issuing office.
    </p>
  </div>

  <ClearanceWizard requests={data.requests} />
</div>
