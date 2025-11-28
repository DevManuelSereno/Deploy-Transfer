import * as z from 'zod';

export const ClassificationScalarFieldEnumSchema = z.enum(['id', 'description', 'createdAt', 'updatedAt'])

export type ClassificationScalarFieldEnum = z.infer<typeof ClassificationScalarFieldEnumSchema>;