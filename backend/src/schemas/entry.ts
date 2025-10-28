import { z } from 'zod';

export const EntryTypeSchema = z.enum(['MOVIE', 'TV_SHOW'], {
  message: 'Entry type must be either MOVIE or TV_SHOW',
});

export const EntryCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  
  type: EntryTypeSchema,
  
  director: z
    .string()
    .min(1, 'Director is required')
    .max(255, 'Director name must be less than 255 characters')
    .trim(),
  
  budget: z
    .string()
    .min(1, 'Budget is required')
    .max(100, 'Budget must be less than 100 characters')
    .trim(),
  
  location: z
    .string()
    .min(1, 'Location is required')
    .max(255, 'Location must be less than 255 characters')
    .trim(),
  
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration must be less than 50 characters')
    .trim(),
  
  year: z
    .string()
    .min(1, 'Year is required')
    .regex(/^\d{4}$/, 'Year must be a 4-digit number')
    .refine((year) => {
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear();
      return yearNum >= 1800 && yearNum <= currentYear + 10;
    }, 'Year must be between 1800 and 10 years in the future'),
});

export const EntryUpdateSchema = EntryCreateSchema.partial();

export const EntryIdSchema = z.object({
  id: z
    .string()
    .min(1, 'Entry ID is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid entry ID format'),
});

export const PaginationSchema = z.object({
  cursor: z
    .string()
    .optional()
    .refine((cursor) => {
      if (!cursor) return true;
      return /^[a-zA-Z0-9_-]+$/.test(cursor);
    }, 'Invalid cursor format'),
  
  limit: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 20)
    .refine((limit) => limit >= 1 && limit <= 100, 'Limit must be between 1 and 100'),
});

export type EntryCreateInput = z.infer<typeof EntryCreateSchema>;
export type EntryUpdateInput = z.infer<typeof EntryUpdateSchema>;
export type EntryIdInput = z.infer<typeof EntryIdSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type EntryType = z.infer<typeof EntryTypeSchema>;