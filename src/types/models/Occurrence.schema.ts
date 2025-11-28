import * as z from "zod";

export const OccurrenceSchema = z.object({
	id: z.number().int(),
	occurrenceDate: z.date(),
	registerDate: z.date(),
	description: z.string(),
	seriousnessId: z.number().int(),
	classificationId: z.number().int(),
	vehicleId: z.number().int(),
	fileId: z.number().int().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type OccurrenceType = z.infer<typeof OccurrenceSchema>;
