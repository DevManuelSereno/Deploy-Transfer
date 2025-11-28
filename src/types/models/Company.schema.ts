import * as z from 'zod';

export const CompanySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  cnpj: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CompanyType = z.infer<typeof CompanySchema>;
