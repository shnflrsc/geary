import { z } from 'zod';
import { CATEGORY_SLUGS } from '../data/categories.ts';

const httpUrlSchema = z.url({ protocol: /^https?$/ });

export const articleSourceSchema = z.object({
  label: z.string().min(1),
  url: httpUrlSchema.optional(),
});

export const articleSchema = z.object({
  title: z.string().min(1),
  category: z.enum(CATEGORY_SLUGS),
  subcategory: z.string().min(1),
  updatedDate: z.coerce.date(),
  source: z.string().min(1).optional(),
  sourceUrl: httpUrlSchema.optional(),
  sources: z.array(articleSourceSchema).min(1).optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleSchema>;
