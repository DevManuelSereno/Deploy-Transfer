import * as z from 'zod';

export const DocumentationScalarFieldEnumSchema = z.enum(['id', 'type', 'expiryAt', 'anticipateRenewal', 'days', 'document', 'vehicleId', 'createdAt', 'updatedAt'])

export type DocumentationScalarFieldEnum = z.infer<typeof DocumentationScalarFieldEnumSchema>;