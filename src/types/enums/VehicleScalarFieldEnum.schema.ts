import * as z from 'zod';

export const VehicleScalarFieldEnumSchema = z.enum(['id', 'identifier', 'model', 'year', 'capacity', 'doors', 'uf', 'plateType', 'plate', 'renavam', 'chassi', 'review', 'description', 'photos', 'gasId', 'brandId', 'classificationId', 'categoryId', 'companyId', 'statusId', 'createdAt', 'updatedAt'])

export type VehicleScalarFieldEnum = z.infer<typeof VehicleScalarFieldEnumSchema>;