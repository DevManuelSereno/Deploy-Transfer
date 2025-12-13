import * as z from "zod";

export const OccurrenceSchema = z.object({
	// Identificador único da ocorrência
	IDO: z.number().int(),

	// Data e hora de criação da ocorrência
	CreatedAt: z.string(),

	// Data e hora da última atualização da ocorrência
	UpdatedAt: z.string(),

	// Id do veículo relacionado à ocorrência
	VehicleId: z.number(),

	// Classificação da ocorrência
	Classification: z.string().max(20),

	// Severidade da ocorrência
	Severity: z.string().max(6),

	// Data e hora em que a ocorrência aconteceu
	OccurrenceAt: z.string(),

	// Número do caso (opcional)
	CaseNumber: z.string().max(20).nullable().optional(),

	// Descrição da ocorrência (opcional)
	Description: z.string().max(255).nullable().optional(),
});

export type OccurrenceType = z.infer<typeof OccurrenceSchema>;
