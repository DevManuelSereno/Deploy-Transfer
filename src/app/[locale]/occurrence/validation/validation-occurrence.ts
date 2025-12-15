import { z } from "zod";
import { OccurrenceSchema } from "@/types/models";

const OccurrenceBaseSchema = OccurrenceSchema.omit({
	IDO: true,
	CreatedAt: true,
	UpdatedAt: true,
});

export const OccurrencePayloadSchema = OccurrenceBaseSchema.extend({
	// OccurrenceAt: z.iso.datetime(),
});

export const OccurrenceFormSchema = OccurrenceBaseSchema.extend({
	Classification: z.string().min(1),
	Severity: z.string().min(1),
	OccurrenceAt: z.string().datetime(),
});
