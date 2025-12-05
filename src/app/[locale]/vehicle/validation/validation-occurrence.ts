import { z } from "zod";
import { OccurrenceSchema } from "@/types/models";
import { FileSchema } from "@/types/models/File.schema";

const OccurrenceBaseSchema = OccurrenceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const FileValueSchema = FileSchema;

export const OccurrencePayloadSchema = OccurrenceBaseSchema.extend({
	occurrenceDate: z.iso.datetime(),
	registerDate: z.iso.datetime(),
	vehicleId: z.coerce.number(),
	seriousnessId: z.coerce.number(),
	classificationId: z.coerce.number(),
	fileId: z.number().optional(),
});

export const OccurrenceFormSchema = OccurrenceBaseSchema.extend({
	description: z.string().optional(),
	occurrenceDate: z.date("Data de ocorrência é obrigatória"),
	registerDate: z.date("Date de registro é obrigatório"),
	days: z.array(z.string()).optional(),
	file: z.array(z.any()).optional(),
	fileId: z.string().optional(),
	vehicleId: z.string(),
	seriousnessId: z.string(),
	classificationId: z.string().min(1, "Classificação é obrigatória"),
});
