import * as z from 'zod';

export const BrandSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BrandType = z.infer<typeof BrandSchema>;
