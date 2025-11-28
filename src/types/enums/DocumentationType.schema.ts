import * as z from "zod";

export const DocumentationTypeSchema = z.enum([
	"Tacógrafo",
	"RNTRC",
	"Apólice RCTR-C",
	"Laudo de Aferição",
]);

export type DocumentationType = z.infer<typeof DocumentationTypeSchema>;
