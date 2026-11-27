/**
 * Pure tool logic for the Geary MCP Worker. Operates only on the static
 * `/corpus.json` payload (`SW-INT-05`); no site-code or network imports.
 */

export interface CorpusSource {
  label: string;
  url?: string;
}

export interface CorpusArticle {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  subcategory?: string;
  updatedDate: string;
  preview: string;
  sources: CorpusSource[];
  /** Raw `.md` file bytes: YAML frontmatter plus Markdown body. */
  content: string;
}

export interface CorpusCategoryMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
}

export interface Corpus {
  categories: CorpusCategoryMeta[];
  articles: CorpusArticle[];
}

export interface SearchResult {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  updatedDate: string;
  preview: string;
}

const SEARCH_LIMIT = 8;
const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

function articleBodyText(article: CorpusArticle): string {
  return article.content.replace(FRONTMATTER_RE, '').toLowerCase();
}

/**
 * Literal substring scoring across title, subcategory, preview, and body.
 * Mirrors the weighting spirit of `src/lib/search.ts` (title > context > body)
 * but searches full article bodies per `SRS-FUNC-MCP-02`.
 */
export function searchArticles(
  corpus: Corpus,
  query: string,
  category?: string,
  limit = SEARCH_LIMIT,
): SearchResult[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const pool = category
    ? corpus.articles.filter((a) => a.category === category)
    : corpus.articles;

  const scored: Array<{ article: CorpusArticle; score: number }> = [];
  for (const article of pool) {
    const title = article.title.toLowerCase();
    const context = `${article.subcategory ?? ''} ${article.preview} ${article.categoryLabel}`.toLowerCase();
    const body = articleBodyText(article);
    const haystack = `${title} ${context} ${body}`;

    if (!tokens.every((t) => haystack.includes(t))) continue;

    let score = title.includes(query.trim().toLowerCase()) ? 20 : 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 10;
      if (context.includes(token)) score += 5;
      if (body.includes(token)) score += 2;
    }
    scored.push({ article, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title))
    .slice(0, limit)
    .map(({ article }) => ({
      slug: article.slug,
      title: article.title,
      category: article.category,
      subcategory: article.subcategory ?? '',
      updatedDate: article.updatedDate,
      preview: article.preview,
    }));
}

export function getArticle(corpus: Corpus, slug: string): CorpusArticle | undefined {
  return corpus.articles.find((a) => a.slug === slug);
}

export interface CategoryNode {
  slug: string;
  title: string;
  description: string;
  articleCount: number;
  subcategories: Array<{
    name: string;
    articles: Array<{ slug: string; title: string }>;
  }>;
}

export function listCategories(corpus: Corpus): CategoryNode[] {
  return [...corpus.categories]
    .sort((a, b) => a.order - b.order)
    .map((meta) => {
      const articles = corpus.articles
        .filter((a) => a.category === meta.slug)
        .sort((a, b) => a.title.localeCompare(b.title));

      const subMap = new Map<string, Array<{ slug: string; title: string }>>();
      for (const article of articles) {
        const sub = article.subcategory ?? 'General';
        const list = subMap.get(sub) ?? [];
        list.push({ slug: article.slug, title: article.title });
        subMap.set(sub, list);
      }

      return {
        slug: meta.slug,
        title: meta.title,
        description: meta.description,
        articleCount: articles.length,
        subcategories: [...subMap.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, items]) => ({ name, articles: items })),
      };
    });
}

export interface CategoryFreshness {
  category: string;
  title: string;
  articleCount: number;
  oldestUpdatedDate: string | null;
}

export function getFreshness(corpus: Corpus): CategoryFreshness[] {
  return [...corpus.categories]
    .sort((a, b) => a.order - b.order)
    .map((meta) => {
      const articles = corpus.articles.filter((a) => a.category === meta.slug);
      const oldest = articles.reduce<string | undefined>(
        (min, a) => (min === undefined || a.updatedDate < min ? a.updatedDate : min),
        undefined,
      );
      return {
        category: meta.slug,
        title: meta.title,
        articleCount: articles.length,
        oldestUpdatedDate: oldest ?? null,
      };
    });
}
