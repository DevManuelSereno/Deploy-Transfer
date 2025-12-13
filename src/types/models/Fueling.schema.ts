import * as z from "zod";

export const FuelingSchema = z.object({
	// Identificador único do abastecimento
	IDF: z.number().int(),

	// Data e hora de criação do registro
	CreatedAt: z.string(),

	// Data e hora da última atualização do registro
	UpdatedAt: z.string(),

	// Data e hora do abastecimento
	FuelingAt: z.string(),

	// Id do motorista
	DriverId: z.number(),

	// Id do veículo
	VehicleId: z.number(),

	// Id do fornecedor/posto
	ProviderId: z.number(),

	// Quilometragem para próxima manutenção (opcional)
	MaintenanceDue: z.number().nullable().optional(),

	// Hodômetro no momento do abastecimento
	Odometer: z.number(),

	// Tipo de combustível
	Fuel: z.string().max(15),

	// Valor total do abastecimento
	Total: z.number(),
});

export type FuelingType = z.infer<typeof FuelingSchema>;
