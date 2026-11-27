import matter from 'gray-matter';
import { Marked, type Token, type Tokens } from 'marked';
import { getCategoryBySlug } from '../../data/categories.ts';
import { getArticlePreview, type ArticleLike } from '../articles.ts';
import { articleSchema, type ArticleFrontmatter } from '../content-schema.ts';
import type { SearchIndexItem } from '../search.ts';

export interface MarkdownHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface ParsedArticle extends ArticleLike {
  id: string;
  slug: string;
  body: string;
  data: ArticleFrontmatter;
  html: string;
  headings: MarkdownHeading[];
  preview: string;
}

function extractPlainText(tokens: readonly Token[] | undefined): string {
  if (!tokens) return '';
  let out = '';
  for (const token of tokens) {
    if ('tokens' in token && Array.isArray(token.tokens) && token.tokens.length > 0) {
      out += extractPlainText(token.tokens);
    } else if ('text' in token && typeof token.text === 'string') {
      out += token.text;
    }
  }
  return out;
}

/** Generate a GitHub-style heading anchor slug with deterministic deduplication. */
export function slugifyHeading(text: string, seen: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const normalized = base || 'section';
  const count = seen.get(normalized) ?? 0;
  seen.set(normalized, count + 1);
  return count === 0 ? normalized : `${normalized}-${count}`;
}

/** Extract canonical URL slug from a Markdown file path. */
export function slugFromFilePath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const fileName = normalized.split('/').pop() ?? normalized;
  return fileName.replace(/\.md$/i, '');
}

/** Parse, Zod-validate, and compile a single Markdown article file. */
export function parseArticleMarkdown(filePath: string, rawContent: string): ParsedArticle {
  let parsedMatter: matter.GrayMatterFile<string>;
  try {
    parsedMatter = matter(rawContent);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid YAML frontmatter in ${filePath}: ${message}`);
  }

  const validation = articleSchema.safeParse(parsedMatter.data);
  if (!validation.success) {
    const issues = validation.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid article schema in ${filePath}: ${issues}`);
  }

  const data = validation.data;
  const slug = slugFromFilePath(filePath);
  const body = parsedMatter.content;
  const headings: MarkdownHeading[] = [];
  const seenSlugs = new Map<string, number>();

  const marked = new Marked({
    gfm: true,
    breaks: false,
  });

  marked.use({
    renderer: {
      heading(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Heading) {
        const innerHtml = this.parser.parseInline(token.tokens);
        const plainText = extractPlainText(token.tokens).trim();
        const headingSlug = slugifyHeading(plainText, seenSlugs);
        headings.push({
          depth: token.depth,
          slug: headingSlug,
          text: plainText,
        });
        return `<h${token.depth} id="${headingSlug}">${innerHtml}</h${token.depth}>\n`;
      },
    },
  });

  const html = marked.parse(body, { async: false });
  const preview = getArticlePreview({ body, data });

  return {
    id: slug,
    slug,
    body,
    data,
    html,
    headings,
    preview,
  };
}

/** Parse and sort all Markdown articles from a path->raw map, rejecting duplicate slugs. */
export function loadArticlesFromRawMap(rawMap: Record<string, string>): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const seenSlugs = new Set<string>();

  for (const [filePath, rawContent] of Object.entries(rawMap)) {
    const article = parseArticleMarkdown(filePath, rawContent);
    if (seenSlugs.has(article.slug)) {
      throw new Error(`Duplicate article slug "${article.slug}" found at ${filePath}`);
    }
    seenSlugs.add(article.slug);
    articles.push(article);
  }

  return articles.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

/** Serialize parsed articles into the client search index contract. */
export function buildSearchIndex(articles: readonly ParsedArticle[]): SearchIndexItem[] {
  return [...articles]
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .map((entry) => {
      const categoryMeta = getCategoryBySlug(entry.data.category);
      return {
        slug: entry.slug,
        title: entry.data.title,
        preview: entry.preview,
        category: entry.data.category,
        categoryLabel: categoryMeta?.title ?? entry.data.category,
        headings: entry.headings
          .filter((h) => h.depth === 2 || h.depth === 3)
          .map((h) => h.text),
      };
    });
}
