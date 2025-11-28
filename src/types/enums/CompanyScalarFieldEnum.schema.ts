import * as z from 'zod';

export const CompanyScalarFieldEnumSchema = z.enum(['id', 'name', 'cnpj', 'createdAt', 'updatedAt'])

export type CompanyScalarFieldEnum = z.infer<typeof CompanyScalarFieldEnumSchema>;