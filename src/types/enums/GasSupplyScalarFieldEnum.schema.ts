import * as z from 'zod';

export const GasSupplyScalarFieldEnumSchema = z.enum(['id', 'kmToReview', 'kmToStop', 'quantity', 'supplyAt', 'totalPrice', 'receipt', 'gasId', 'vehicleId', 'createdAt', 'updatedAt'])

export type GasSupplyScalarFieldEnum = z.infer<typeof GasSupplyScalarFieldEnumSchema>;