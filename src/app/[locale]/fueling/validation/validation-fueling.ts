import { z } from "zod";

export const FuelingPayloadSchema = z.object({
	VehicleId: z.coerce.number(),
	Date: z.string(),
	Liters: z.coerce.number(),
	PricePerLiter: z.coerce.number(),
	TotalCost: z.coerce.number(),
	Odometer: z.coerce.number(),
	FuelType: z.string(),
	Station: z.string(),
	Location: z.string(),
	Driver: z.string().optional(),
	Notes: z.string().optional(),
});

export const FuelingFormSchema = z.object({
	VehicleId: z.string().min(1, "Veículo é obrigatório").optional(),
	Date: z.string().min(1, "Data é obrigatória"),
	Liters: z.number().min(0.1, "Litros é obrigatório"),
	PricePerLiter: z.number().min(0.01, "Preço por litro é obrigatório").optional(),
	TotalCost: z.number().min(0.01, "Custo total é obrigatório"),
	Odometer: z.number().min(0, "Odômetro é obrigatório"),
	FuelType: z.string().min(1, "Tipo de combustível é obrigatório"),
	Station: z.string().min(1, "Posto é obrigatório").max(100),
	Location: z.string().min(1, "Local é obrigatório").max(100).optional(),
	Driver: z.string().max(100).optional(),
	Notes: z.string().max(500).optional(),
	file: z.any().optional(),
});
