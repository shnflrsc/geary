<script lang="ts">
  import type { PageProps } from './$types';
  import ArticleLayout from '#lib/components/ArticleLayout.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';

  const { data }: PageProps = $props();

  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
</script>

<SeoHead
  title={data.title}
  description={data.preview}
  canonicalUrl={data.articleUrl}
  ogType="article"
  {ogImageUrl}
  ogImageAlt={`${data.title} - Geary BulSU Student Article`}
  articleMeta={{
    modifiedTime: data.modifiedTime,
    section: data.categoryMeta.title,
    tag: data.subcategory,
  }}
  jsonLd={data.jsonLd}
/>

<ArticleLayout
  title={data.title}
  formattedDate={data.formattedDate}
  articleUrl={data.articleUrl}
  categoryMeta={data.categoryMeta}
  headings={data.headings}
  html={data.html}
  sources={data.sources}
/>
