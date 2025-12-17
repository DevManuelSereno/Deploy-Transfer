import { z } from "zod";
import { DocumentationSchema } from "@/types/models";

const DocumentationBaseSchema = DocumentationSchema.omit({
	IDD: true,
	CreatedAt: true,
	UpdatedAt: true,
});

export const DocumentationPayloadSchema = DocumentationBaseSchema.extend({
	ExpiryAt: z.string().datetime(),
	VehicleId: z.coerce.number(),
	FileId: z.number().optional(),
});

export const DocumentationFormSchema = DocumentationBaseSchema.extend({
	Type: z.string().min(1, "Tipo é obrigatório"),
	ExpiryAt: z.string().min(1),
	VehicleId: z.string().min(1),
	File: z.array(z.any()).optional(),
});
