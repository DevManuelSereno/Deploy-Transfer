import * as z from 'zod';

export const SeriousnessScalarFieldEnumSchema = z.enum(['id', 'level', 'createdAt', 'updatedAt'])

export type SeriousnessScalarFieldEnum = z.infer<typeof SeriousnessScalarFieldEnumSchema>;