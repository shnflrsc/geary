import { z } from 'zod';
import { CATEGORY_ICONS, normalizeCategory } from '../data/categories.ts';

const httpUrlSchema = z.url({ protocol: /^https?$/ });

export const articleSourceSchema = z.object({
  label: z.string().min(1),
  url: httpUrlSchema.optional(),
});

export const articleSchema = z.object({
  title: z.string().min(1),
  category: z
    .string()
    .trim()
    .min(1)
    .transform(normalizeCategory)
    .refine((value) => value.length > 0, 'Category must contain letters or numbers'),
  categoryIcon: z.enum(CATEGORY_ICONS).optional(),
  updatedDate: z.coerce.date(),
  source: z.string().min(1).optional(),
  sourceUrl: httpUrlSchema.optional(),
  sources: z.array(articleSourceSchema).min(1).optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleSchema>;
