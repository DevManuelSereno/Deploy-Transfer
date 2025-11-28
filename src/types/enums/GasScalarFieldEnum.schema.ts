import * as z from 'zod';

export const GasScalarFieldEnumSchema = z.enum(['id', 'type', 'createdAt', 'updatedAt'])

export type GasScalarFieldEnum = z.infer<typeof GasScalarFieldEnumSchema>;