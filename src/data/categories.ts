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

export const CATEGORIES: readonly CategoryMeta[] = [
  {
    slug: 'enrollment',
    title: 'Enrollment',
    description:
      'Step-by-step requirements and timelines for freshmen, shiftees, transferees, adding/dropping, and COR.',
    icon: 'admission',
    order: 1,
  },
  {
    slug: 'academics',
    title: 'Academics',
    description:
      'Grades, INC completion, GWA & Latin honors, retention/probation rules, and thesis/OJT articles.',
    icon: 'academics',
    order: 2,
  },
  {
    slug: 'documents',
    title: 'Documents',
    description:
      'Requesting TOR, COG, Good Moral certificates, ID replacement, clearances, and certifications.',
    icon: 'document',
    order: 3,
  },
  {
    slug: 'scholarships',
    title: 'Scholarships',
    description:
      'Academic scholarships, UniFAST TES/TDP grants, CHED/DOST, and LGU financial assistance.',
    icon: 'scholarship',
    order: 4,
  },
  {
    slug: 'policies',
    title: 'Policies',
    description:
      'Dress code and uniform rules, attendance, student conduct, grievances, disciplinary hearings, and trips.',
    icon: 'policy',
    order: 5,
  },
  {
    slug: 'organizations',
    title: 'Organizations',
    description:
      'Student org recognition, advisers, fraternities, activity permits, postings, fundraising, and campus media.',
    icon: 'organizations',
    order: 6,
  },
  {
    slug: 'campus',
    title: 'Campus',
    description:
      'Clinic, accident insurance, library, guidance and PWD support, housing, dining, varsity, and safety.',
    icon: 'campus',
    order: 7,
  },
] as const;

/** Look up category metadata by its canonical slug. */
export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
