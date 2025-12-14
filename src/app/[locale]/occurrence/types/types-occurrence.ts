import type { z } from "zod";
import type {
	OccurrenceFormSchema,
	OccurrencePayloadSchema,
} from "@/app/[locale]/occurrence/validation/validation-occurrence";
import type { OccurrenceType } from "@/types/models";

export type OccurrencePayload = z.infer<typeof OccurrencePayloadSchema>;
export type OccurrenceForm = z.infer<typeof OccurrenceFormSchema>;

export type OccurrenceData = OccurrenceType & {
	// classification: ClassificationType;
	// severity: SeriousnessType;
};
