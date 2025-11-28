import * as z from 'zod';

export const PlateTypeSchema = z.enum(['MERCOSUL', 'OUTRO'])

export type PlateType = z.infer<typeof PlateTypeSchema>;