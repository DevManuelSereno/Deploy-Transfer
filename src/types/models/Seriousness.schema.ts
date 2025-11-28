import * as z from 'zod';

export const SeriousnessSchema = z.object({
  id: z.number().int(),
  level: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SeriousnessType = z.infer<typeof SeriousnessSchema>;
