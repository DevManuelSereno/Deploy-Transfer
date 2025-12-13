import * as z from "zod";

export const ScheduleSchema = z.object({
	// Identificador único da tabela de Agenda
	IDS: z.number().int(),

	// Informa se é uma agenda de veículo ou usuário (vehicle, user)
	Relation: z.string().max(8),

	// Id do veículo ou do usuário
	RelationId: z.number(),

	// Data da Agenda
	ScheduleAt: z.string(),

	// Horário inicial da agenda
	StartTime: z.string(),

	// Horário final da agenda
	EndTime: z.string(),

	// Classificação da Agenda
	// (ex: maintenance = Manutenção, leave = Folga, transfer = Transporte, sick_note = Atestado Médico)
	Classification: z.string().max(20),

	// Data de criação da Agenda
	CreatedAt: z.string(),

	// Data de atualização da Agenda
	UpdatedAt: z.string(),
});

export type ScheduleType = z.infer<typeof ScheduleSchema>;
