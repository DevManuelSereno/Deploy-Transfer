import type { z } from "zod";
import type {
	DocumentationFormSchema,
	DocumentationPayloadSchema,
	FileValueSchema,
} from "@/app/[locale]/vehicle/validation/validation-documentation";
import type { DocumentationType } from "@/types/models";
import type { FileType } from "@/types/models/File.schema";

export type DocumentationPayload = z.infer<typeof DocumentationPayloadSchema>;
export type DocumentationForm = z.infer<typeof DocumentationFormSchema>;

export type FileValue = z.infer<typeof FileValueSchema>;

export const documentationTypes = [
	"Tacógrafo",
	"RNTRC",
	"Apólice RCTR-C",
	"Laudo de Aferição",
];

export type DocumentationData = Omit<DocumentationType, "expiryAt"> & {
	expiryAt: string;
	file?: FileType | null;
};
