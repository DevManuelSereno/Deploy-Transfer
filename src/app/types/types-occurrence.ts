import type { z } from "zod";
import type {
	FileValueSchema,
	OccurrenceFormSchema,
	OccurrencePayloadSchema,
} from "@/app/validation/validation-occurrence";
import type {
	ClassificationType,
	OccurrenceType,
	SeriousnessType,
} from "@/types/models";
import type { FileType } from "@/types/models/File.schema";

export type OccurrencePayload = z.infer<typeof OccurrencePayloadSchema>;
export type OccurrenceForm = z.infer<typeof OccurrenceFormSchema>;

export type FileValue = z.infer<typeof FileValueSchema>;

export type OccurrenceData = Omit<
	OccurrenceType,
	"occurrenceDate" | "registerDate"
> & {
	occurrenceDate: string;
	registerDate: string;
	file?: FileType | null;
	classification: ClassificationType;
	seriousness: SeriousnessType;
};
