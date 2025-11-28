import * as z from 'zod';

export const GasStationScalarFieldEnumSchema = z.enum(['id', 'name', 'createdAt', 'updatedAt'])

export type GasStationScalarFieldEnum = z.infer<typeof GasStationScalarFieldEnumSchema>;