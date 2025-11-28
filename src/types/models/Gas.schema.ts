import * as z from 'zod';

export const GasSchema = z.object({
  id: z.number().int(),
  type: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GasType = z.infer<typeof GasSchema>;
