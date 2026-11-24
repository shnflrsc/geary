import { resolveArticleSources, type ArticleSource } from './articles';

export interface BreadcrumbItemInput {
  name: string;
  url?: string;
}

export interface ArticleJsonLdInput {
  title: string;
  description: string;
  url: string;
  dateModified: Date;
  section: string;
  source?: string;
  sourceUrl?: string;
  sources?: readonly ArticleSource[];
}

export type JsonLdObject = Record<string, unknown>;

const PUBLISHER_ENTITY: JsonLdObject = {
  '@type': 'Organization',
  name: 'Geary (Unofficial BulSU Student Hub)',
};

/** Build Schema.org WebSite JSON-LD for the Home page. */
export function buildWebsiteJsonLd(siteUrl: string): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Geary',
    alternateName: 'The Better BulSU Student Handbook',
    url: new URL('/', siteUrl).href,
    description: 'Student-managed articles for BulSUans, by BulSUans.',
    inLanguage: 'en',
  };
}

/** Build Schema.org BreadcrumbList JSON-LD matching visual page breadcrumbs. */
export function buildBreadcrumbJsonLd(items: readonly BreadcrumbItemInput[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/** Format a resolved source item into Schema.org citation format. */
function formatCitationEntry(entry: ArticleSource): JsonLdObject | string {
  return entry.url
    ? {
        '@type': 'CreativeWork',
        name: entry.label,
        url: entry.url,
      }
    : entry.label;
}

const DEFAULT_SITE_URL = 'https://geary.example.com';

/** Resolve the canonical site origin URL from an explicit site URL or the current request URL. */
export function resolveSiteOrigin(site: URL | undefined, fallbackUrl?: URL): URL {
  return site ?? (fallbackUrl ? new URL(fallbackUrl.origin) : new URL(DEFAULT_SITE_URL));
}

/** Resolve the canonical site origin from deployment env vars or the incoming SSR request URL. */
export function resolveRequestOrigin(
  requestUrl?: URL,
  env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {},
): URL {
  const configured =
    env.PUBLIC_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : env.VERCEL_URL
        ? `https://${env.VERCEL_URL}`
        : undefined);
  return resolveSiteOrigin(configured ? new URL(configured) : undefined, requestUrl);
}

/** Build Schema.org Article JSON-LD for published articles. */
export function buildArticleJsonLd(input: ArticleJsonLdInput): JsonLdObject {
  const citations = resolveArticleSources(input).map(formatCitationEntry);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    dateModified: input.dateModified.toISOString(),
    articleSection: input.section,
    inLanguage: 'en',
    author: PUBLISHER_ENTITY,
    publisher: PUBLISHER_ENTITY,
    ...(citations.length === 1
      ? { citation: citations[0] }
      : citations.length > 1
        ? { citation: citations }
        : {}),
  };
}

/** Escape `<` to prevent closing `</script>` injection inside inline JSON-LD tags. */
export function serializeJsonLd(data: JsonLdObject): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
