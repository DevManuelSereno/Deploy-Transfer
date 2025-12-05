import * as z from "zod";

export const DocumentationSchema = z.object({
	id: z.number().int(),
	type: z.string(),
	expiryAt: z.date(),
	anticipateRenewal: z.boolean(),
	days: z.array(z.string()),
	vehicleId: z.number().int(),
	fileId: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type DocumentationType = z.infer<typeof DocumentationSchema>;
