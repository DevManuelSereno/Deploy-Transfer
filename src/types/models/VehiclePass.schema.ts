import * as z from "zod";

export const VehiclePassSchema = z.object({
	// Identificador único do veículo
	IDV: z.number().int(),

	// Placa do veículo (única)
	Plate: z.string().max(7),

	// Modelo do veículo (ex.: Corolla, Sprinter) Campo texto
	Model: z.string().max(50),

	// Ano de fabricação do veículo
	Year: z.number(),

	// Cor do veículo
	Color: z.string().max(15).nullable().optional(),

	// Quantidade de assentos disponíveis para passageiros
	Seats: z.number(),

	// Número do Chassis do veículo
	Chassis: z.string().max(21),

	// Combustível que o Veículo utiliza
	// (Ex: Diesel + Arla, Diesel, Etanol, Gasolina, GNV, GLP, Querosene Aviação, Electricity, Etc...)
	Fuel: z.string().max(10),

	// Status do veículo (pending, released, maintenance, block)
	Status: z.string().max(15).nullable().optional(),

	// Sigla do estado em que o veículo foi registrado
	Location: z.string().max(4),

	// Quantidade de portas do veículo
	Door: z.number(),

	// Capacidade de bagagem em número de malas médias
	LuggageCapacity: z.number().nullable().optional(),

	// Categoria do veículo (ex.: Sedan, SUV, Van, Micro-ônibus)
	Category: z.string().max(20),

	// Número do RENAVAM do veículo ou código de registro caso for internacional
	RegistrationCode: z.string().max(20),

	/// Lista de comodidades do veículo (ex.: ar-condicionado, Wi-Fi, carregador USB)
	Amenities: z.string().max(255).nullable().optional(),

	// Período de KM para Inspeção do veículo (ex: a cada 10.000 km o veículo precisa fazer a revisão)
	InspectionInterval: z.number().max(999999).nullable().optional(),

	// id da companhia em que o veículo está vinculado
	CompanyId: z.number(),

	// Marca do veículo (ex.: Toyota, Mercedes)
	BrandId: z.number(),

	// Data e hora em que o veículo foi cadastrado
	CreatedAt: z.string(),

	// Data e hora da última atualização do cadastro do veículo
	UpdatedAt: z.string(),
});

export type VehiclePassType = z.infer<typeof VehiclePassSchema>;
