import * as z from 'zod';
import { PlateTypeSchema } from '../enums/PlateType.schema';

export const VehicleSchema = z.object({
  id: z.number().int(),
  identifier: z.string(),
  model: z.string(),
  year: z.string(),
  capacity: z.number().int(),
  doors: z.number().int(),
  uf: z.string(),
  plateType: PlateTypeSchema,
  plate: z.string(),
  renavam: z.string(),
  chassi: z.string(),
  review: z.number().int(),
  description: z.string().nullish(),
  photos: z.array(z.string()),
  gasId: z.number().int(),
  brandId: z.number().int(),
  classificationId: z.number().int(),
  categoryId: z.number().int(),
  companyId: z.number().int(),
  statusId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type VehicleType = z.infer<typeof VehicleSchema>;
