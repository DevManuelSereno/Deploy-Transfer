import * as z from 'zod';

export const GasStationSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GasStationType = z.infer<typeof GasStationSchema>;
