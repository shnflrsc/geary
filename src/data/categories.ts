export const CATEGORY_SLUGS = [
  'enrollment',
  'academics',
  'documents',
  'scholarships',
  'policies',
  'organizations',
  'campus',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface CategoryMeta {
  slug: CategorySlug;
  title: string;
  description: string;
  icon:
    | 'admission'
    | 'academics'
    | 'document'
    | 'scholarship'
    | 'policy'
    | 'organizations'
    | 'campus';
  order: number;
}

const CATEGORY_RECORD: Record<CategorySlug, Omit<CategoryMeta, 'slug'>> = {
  enrollment: {
    title: 'Enrollment',
    description:
      'Step-by-step requirements and timelines for freshmen, shiftees, transferees, adding/dropping, and COR.',
    icon: 'admission',
    order: 1,
  },
  academics: {
    title: 'Academics',
    description:
      'Grades, INC completion, GWA & Latin honors, retention/probation rules, and thesis/OJT articles.',
    icon: 'academics',
    order: 2,
  },
  documents: {
    title: 'Documents',
    description:
      'Requesting TOR, COG, Good Moral certificates, ID replacement, clearances, and certifications.',
    icon: 'document',
    order: 3,
  },
  scholarships: {
    title: 'Scholarships',
    description:
      'Academic scholarships, UniFAST TES/TDP grants, CHED/DOST, and LGU financial assistance.',
    icon: 'scholarship',
    order: 4,
  },
  policies: {
    title: 'Policies',
    description:
      'Dress code and uniform rules, attendance, student conduct, grievances, disciplinary hearings, and trips.',
    icon: 'policy',
    order: 5,
  },
  organizations: {
    title: 'Organizations',
    description:
      'Student org recognition, advisers, fraternities, activity permits, postings, fundraising, and campus media.',
    icon: 'organizations',
    order: 6,
  },
  campus: {
    title: 'Campus',
    description:
      'Clinic, accident insurance, library, guidance and PWD support, housing, dining, varsity, and safety.',
    icon: 'campus',
    order: 7,
  },
};

export const CATEGORIES: readonly CategoryMeta[] = CATEGORY_SLUGS.map((slug) => ({
  slug,
  ...CATEGORY_RECORD[slug],
}));

/** Look up category metadata by its canonical slug. */
export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  if (!(slug in CATEGORY_RECORD)) return undefined;
  const canonicalSlug = slug as CategorySlug;
  return { slug: canonicalSlug, ...CATEGORY_RECORD[canonicalSlug] };
}
