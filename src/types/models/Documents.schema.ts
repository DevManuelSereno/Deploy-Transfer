import * as z from "zod";

export const DocumentsSchema = z.object({
	// Identificador único do documento
	IDD: z.number().int(),

	// Data e hora em que o documento foi cadastrado
	CreatedAt: z.string(),

	// Data e hora em que o documento foi atualizado
	UpdatedAt: z.string(),

	// Data e hora de vencimento do documento
	ExpirationAt: z.string(),

	// Id do veículo ou do motorista (foreign key)
	RelationId: z.number(),

	// Informa se o documento é de um motorista ou do veículo
	Relation: z.string().max(8),

	// Tipo de documento (ex: crlv, antt, crv, etc...)
	Type: z.string().max(20),

	// Quantidade de dias antes do vencimento para emitir alerta
	DaysAlert: z.number().nullable().optional(),

	// Emissão de alerta antecipado (0 = não, 1 = sim)
	Alert: z.number().int().nullable().optional(),

	// Número do documento (ex: CNPJ, CPF, RG, Renavam, etc...)
	Document: z.string().max(25).nullable().optional(),
});

export type DocumentsType = z.infer<typeof DocumentsSchema>;
