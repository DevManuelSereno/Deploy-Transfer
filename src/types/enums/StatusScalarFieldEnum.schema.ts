import * as z from 'zod';

export const StatusScalarFieldEnumSchema = z.enum(['id', 'name', 'createdAt', 'updatedAt'])

export type StatusScalarFieldEnum = z.infer<typeof StatusScalarFieldEnumSchema>;