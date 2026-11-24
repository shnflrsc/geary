<script lang="ts">
  import { serializeJsonLd, type JsonLdObject } from '#lib/seo';

  export interface ArticleOgMeta {
    modifiedTime: string;
    section: string;
    tag?: string;
  }

  interface Props {
    title: string;
    description?: string;
    canonicalUrl?: string;
    ogType?: 'website' | 'article';
    ogImageUrl: string;
    ogImageAlt?: string;
    articleMeta?: ArticleOgMeta;
    noindex?: boolean;
    jsonLd?: JsonLdObject | JsonLdObject[];
  }

  const {
    title,
    description = 'Unofficial Bulacan State University student information hub for enrollment, shifting, Registrar forms, handbook policies, and campus spots.',
    canonicalUrl,
    ogType = 'website',
    ogImageUrl,
    ogImageAlt = 'Geary - The Better BulSU Student Handbook preview card',
    articleMeta,
    noindex = false,
    jsonLd,
  }: Props = $props();

  const jsonLdEntries = $derived(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
  {#if !noindex && canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
  {/if}

  <meta property="og:site_name" content="Geary" />
  <meta property="og:locale" content="en_PH" />
  <meta property="og:type" content={ogType} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {#if canonicalUrl}
    <meta property="og:url" content={canonicalUrl} />
  {/if}
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={ogImageAlt} />

  {#if ogType === 'article' && articleMeta}
    <meta property="article:modified_time" content={articleMeta.modifiedTime} />
    <meta property="article:section" content={articleMeta.section} />
    {#if articleMeta.tag}
      <meta property="article:tag" content={articleMeta.tag} />
    {/if}
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageUrl} />
  <meta name="twitter:image:alt" content={ogImageAlt} />

  {#each jsonLdEntries as entry}
    {@html `<script type="application/ld+json">${serializeJsonLd(entry)}</script>`}
  {/each}
</svelte:head>
