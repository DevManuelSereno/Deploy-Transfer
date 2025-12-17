import type { z } from "zod";
import type {
	DocumentationFormSchema,
	DocumentationPayloadSchema,
} from "@/app/[locale]/documentation/validation/validation-documentation";
import type { DocumentationType } from "@/types/models";

export type DocumentationPayload = z.infer<typeof DocumentationPayloadSchema>;
export type DocumentationForm = z.infer<typeof DocumentationFormSchema>;

export type DocumentationData = DocumentationType;
