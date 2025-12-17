import { z } from "zod";
import { DocumentationSchema } from "@/types/models";
import { FileSchema } from "@/types/models/File.schema";

const DocumentationBaseSchema = DocumentationSchema.omit({
	IDD: true,
	CreatedAt: true,
	UpdatedAt: true,
});

export const FileValueSchema = FileSchema;

export const DocumentationPayloadSchema = DocumentationBaseSchema.extend({
	ExpiryAt: z.string().datetime(),
	VehicleId: z.coerce.number(),
	FileId: z.number().optional(),
	Days: z.array(z.string()).optional(),
});

export const DocumentationFormSchema = z.object({
	Type: z.string().min(1, "Tipo é obrigatório"),
	ExpiryAt: z.date(),
	VehicleId: z.number().int(),
	FileId: z.number().int().optional(),
	days: z.array(z.string()).optional(),
	file: z.array(z.any()).optional(),
	fileId: z.string().optional(),
	vehicleId: z.string(),
});
