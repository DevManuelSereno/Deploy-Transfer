import * as z from 'zod';

export const BrandScalarFieldEnumSchema = z.enum(['id', 'name', 'createdAt', 'updatedAt'])

export type BrandScalarFieldEnum = z.infer<typeof BrandScalarFieldEnumSchema>;