export const CATEGORY_ICONS = [
  'admission',
  'academics',
  'document',
  'certifications',
  'scholarship',
  'policy',
  'organizations',
  'athletics',
  'campus',
  'health',
  'technology',
  'careers',
  'graduation',
] as const;

export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

export type CategorySlug = string;

export interface CategoryMeta {
  slug: CategorySlug;
  title: string;
  description: string;
  icon: CategoryIcon;
}

/** Normalize a raw category string into a lowercase kebab-case slug to prevent duplicates. */
export function normalizeCategory(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Convert a normalized category slug (e.g. `student-life`) into Title Case (`Student Life`). */
export function formatCategoryTitle(slug: string): string {
  return normalizeCategory(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const DEFAULT_CATEGORY_META: Record<string, { icon: CategoryIcon; description: string }> = {
  enrollment: {
    icon: 'admission',
    description:
      'Step-by-step requirements and timelines for freshmen, shiftees, transferees, adding/dropping, and COR.',
  },
  academics: {
    icon: 'academics',
    description:
      'Grades, INC completion, GWA & Latin honors, retention/probation rules, and thesis/OJT articles.',
  },
  documents: {
    icon: 'document',
    description:
      'Requesting TOR, COG, Good Moral certificates, ID replacement, clearances, and certifications.',
  },
  scholarships: {
    icon: 'scholarship',
    description:
      'Academic scholarships, UniFAST TES/TDP grants, CHED/DOST, and LGU financial assistance.',
  },
  policies: {
    icon: 'policy',
    description:
      'Dress code and uniform rules, attendance, student conduct, grievances, disciplinary hearings, and trips.',
  },
  organizations: {
    icon: 'organizations',
    description:
      'Student org recognition, advisers, fraternities, activity permits, postings, fundraising, and campus media.',
  },
  campus: {
    icon: 'campus',
    description:
      'Library, housing, dining, and campus safety guidelines.',
  },
  health: {
    icon: 'health',
    description:
      'University clinic, student insurance, and guidance and counseling services.',
  },
  technology: {
    icon: 'technology',
    description:
      'BulSU Microsoft student accounts, Office 365, and Azure benefits.',
  },
  athletics: {
    icon: 'athletics',
    description:
      'Varsity sports, cultural arts, and university competitions.',
  },
  careers: {
    icon: 'careers',
    description:
      'Internships, OJT, job placement, and student assistantships.',
  },
  graduation: {
    icon: 'graduation',
    description:
      'Graduation requirements, clearances, and Latin honors.',
  },
  certifications: {
    icon: 'certifications',
    description:
      'Good moral, grade, CAV, RLE, and registrar certifications.',
  },
};

export const CATEGORY_SLUGS = Object.keys(DEFAULT_CATEGORY_META);

export const CATEGORIES: readonly CategoryMeta[] = CATEGORY_SLUGS.map((slug) => ({
  slug,
  title: formatCategoryTitle(slug),
  ...DEFAULT_CATEGORY_META[slug]!,
}));

/** Build dynamic category metadata from loaded articles, resolving icons and Title Case labels. */
export function buildDynamicCategories(
  articles: readonly { data: { category: string; categoryIcon?: CategoryIcon } }[],
): CategoryMeta[] {
  const map = new Map<string, CategoryMeta>();

  for (const article of articles) {
    const slug = normalizeCategory(article.data.category);
    if (!slug) continue;

    const existing = map.get(slug);
    if (existing) {
      if (article.data.categoryIcon && !existing.icon) {
        existing.icon = article.data.categoryIcon;
      }
      continue;
    }

    const title = formatCategoryTitle(slug);
    const defaults = DEFAULT_CATEGORY_META[slug];
    map.set(slug, {
      slug,
      title,
      description: defaults?.description ?? `BulSU student articles on ${title}.`,
      icon: article.data.categoryIcon ?? defaults?.icon ?? 'document',
    });
  }

  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
}

/** Resolve category metadata for any normalized slug, using built-in defaults when available. */
export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  const normalized = normalizeCategory(slug);
  if (!normalized) return undefined;
  const title = formatCategoryTitle(normalized);
  const defaults = DEFAULT_CATEGORY_META[normalized];
  return {
    slug: normalized,
    title,
    description: defaults?.description ?? `BulSU student articles on ${title}.`,
    icon: defaults?.icon ?? 'document',
  };
}
