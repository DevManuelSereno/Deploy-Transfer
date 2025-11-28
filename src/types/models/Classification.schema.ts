import * as z from 'zod';

export const ClassificationSchema = z.object({
  id: z.number().int(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ClassificationType = z.infer<typeof ClassificationSchema>;
