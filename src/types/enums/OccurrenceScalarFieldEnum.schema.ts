import * as z from 'zod';

export const OccurrenceScalarFieldEnumSchema = z.enum(['id', 'date', 'description', 'attachment', 'seriousnessId', 'classificationId', 'vehicleId', 'createdAt', 'updatedAt'])

export type OccurrenceScalarFieldEnum = z.infer<typeof OccurrenceScalarFieldEnumSchema>;