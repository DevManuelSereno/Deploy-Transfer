import { z } from "zod";
import { VehicleSchema } from "@/types/models";

const VehicleBaseSchema = VehicleSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const ImageValueSchema = z
	.object({
		id: z.string(),
		file: z.instanceof(File).optional(),
		// pode ser URL normal ou data URL (data:image/png;base64,...)
		url: z.string().min(1).optional(),
		name: z.string().optional(),
	})
	.refine((data) => data.file || data.url, {
		message: "É necessário ter pelo menos 'file' ou 'url'.",
	});

export const VehiclePayloadSchema = VehicleBaseSchema.extend({
	capacity: z.coerce.number(),
	doors: z.coerce.number(),
	brandId: z.coerce.number(),
	categoryId: z.coerce.number(),
	classificationId: z.coerce.number(),
	gasId: z.coerce.number(),
	companyId: z.coerce.number(),
	statusId: z.coerce.number(),
	review: z.coerce.number(),

	photos: z.array(z.string()).optional(),
});

export const VehicleFormSchema = VehicleBaseSchema.extend({
	identifier: z.string().min(1, "Identificador é obrigatório"),
	capacity: z.number().min(1, "Capacidade é obrigatória"),
	doors: z.number().min(1, "Nº de portas é obrigatório"),
	brandId: z.string().min(1, "Marca é obrigatória"),
	categoryId: z.string().min(1, "Categoria é obrigatória"),
	classificationId: z.string().min(1, "Classificação é obrigatória"),
	gasId: z.string().min(1, "Combustível é obrigatório"),
	companyId: z.string().min(1, "Empresa é obrigatória"),
	statusId: z.string().min(1, "Status é obrigatório"),
	review: z.number().min(0, "Revisão é obrigatória"),
	model: z.string().min(1, "Modelo é obrigatório"),
	year: z.string().length(4, "Ano deve ter 4 dígitos"),
	plate: z.string().min(7, "Placa inválida").max(8, "Placa inválida"),
	renavam: z.string().length(11, "Renavam deve ter 11 dígitos"),
	chassi: z.string().min(17, "Chassi é obrigatório"),
	uf: z.string().length(2, "UF inválida"),

	photos: z.array(ImageValueSchema).default([]).optional(),
});
