import { z } from "zod";
import { VehicleSchema } from "@/types/models/Vehicle.schema";

const VehicleBaseSchema = VehicleSchema.omit({
	IDV: true,
	CreatedAt: true,
	UpdatedAt: true,
});

export const VehiclePayloadSchema = VehicleBaseSchema.extend({
	Seats: z.coerce.number(),
	Door: z.coerce.number(),
	BrandId: z.coerce.number(),
	CompanyId: z.coerce.number(),
	Year: z.coerce.number(),
});

export const VehicleFormSchema = VehicleBaseSchema.extend({
	Amenities: z
		.object({
			value: z.string(),
			label: z.string(),
		})
		.array(),
	Plate: z.string().length(7, "Placa inválida"),
	Model: z
		.string()
		.min(1, "Modelo é obrigatório")
		.max(50, "Modelo não pode ter mais que 50 caracteres"),
	Year: z.number().gt(1900, "Ano de fabricação inválido"),
	Seats: z.number().min(1, "Nº de assentos é obrigatório"),
	Chassis: z
		.string()
		.min(17, "Chassi é obrigatório")
		.max(21, "Chassi não pode ter mais que 21 caracteres"),
	Fuel: z.string().max(10),
	Location: z.string().max(4),
	Door: z.number().min(1, "Nº de portas é obrigatório"),
	Category: z
		.string()
		.min(1, "Categoria é obrigatória")
		.max(20, "Categoria não pode ter mais que 20 caracteres"),
	RegistrationCode: z
		.string()
		.min(1, "RENAVAM é obrigatório")
		.max(20, "RENAVAM não pode ter mais que 20 caracteres"),
	CompanyId: z.string().min(1, "Empresa é obrigatória"),
	BrandId: z.string().min(1, "Marca é obrigatória"),
});
