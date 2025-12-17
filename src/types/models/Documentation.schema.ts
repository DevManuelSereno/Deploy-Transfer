import * as z from "zod";

export const DocumentationSchema = z.object({
	IDD: z.number().int(),
	Type: z.string(),
	ExpiryAt: z.string(),
	VehicleId: z.number().int(),
	FileId: z.number().int().optional(),
	CreatedAt: z.string(),
	UpdatedAt: z.string(),
});

export type DocumentationType = z.infer<typeof DocumentationSchema>;
