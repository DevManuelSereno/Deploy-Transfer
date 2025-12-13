import { z } from "zod";
import { OccurrenceSchema } from "@/types/models";
import { FileSchema } from "@/types/models/File.schema";

const OccurrenceBaseSchema = OccurrenceSchema.omit({
	IDO: true,
	CreatedAt: true,
	UpdatedAt: true,
});

export const FileValueSchema = FileSchema;

export const OccurrencePayloadSchema = OccurrenceBaseSchema.extend({
	OccurrenceAt: z.iso.datetime(),
	registerDate: z.iso.datetime(),
});

export const OccurrenceFormSchema = OccurrenceBaseSchema.extend({
	description: z.string().optional(),
	days: z.array(z.string()).optional(),
});
