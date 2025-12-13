import * as z from "zod";

export const DriverSchema = z.object({
	// Identificador único da tabela de Motorista
	IDD: z.number().int(),

	// Data de criação do cadastro do motorista
	CreatedAt: z.string(),

	// Data de atualização do cadastro do motorista
	UpdatedAt: z.string(),

	// Senha de acesso ao sistema
	Password: z.string().max(20),

	// Categoria da habilitação (A, B, C, etc...)
	Category: z.string().max(1),

	// Data de nascimento do motorista
	BirthDate: z.string(),

	// Email do motorista
	Email: z.string().max(30),

	// Telefone do motorista
	Phone: z.string().max(20),

	// Rua da residência do motorista
	Street: z.string().max(30),

	// Número da residência do motorista
	Number: z.string().max(5),

	// Bairro da residência do motorista
	District: z.string().max(30),

	// Cidade da residência do motorista
	City: z.string().max(40),

	// Estado da residência do motorista
	State: z.string().max(40),

	// País da residência do motorista
	Country: z.string().max(30),

	// Código postal da residência do motorista
	PostalCode: z.string().max(15),

	// Observações sobre o motorista
	Observation: z.string().max(200),
});

export type DriverType = z.infer<typeof DriverSchema>;
