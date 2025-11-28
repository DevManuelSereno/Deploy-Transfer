import * as z from 'zod';

export const StatusSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type StatusType = z.infer<typeof StatusSchema>;
