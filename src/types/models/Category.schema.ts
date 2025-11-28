import * as z from 'zod';

export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CategoryType = z.infer<typeof CategorySchema>;
