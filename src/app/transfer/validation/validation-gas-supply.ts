import { z } from "zod";
import { GasSupplySchema } from "@/types/models";
import { FileSchema } from "@/types/models/File.schema";

const GasSupplyBaseSchema = GasSupplySchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const FileValueSchema = FileSchema;

export const GasSupplyPayloadSchema = GasSupplyBaseSchema.extend({
	supplyAt: z.iso.datetime(),
	kmToReview: z.coerce.number(),
	kmToStop: z.coerce.number(),
	quantity: z.coerce.number(),
	totalPrice: z.coerce.number(),
	vehicleId: z.coerce.number(),
	gasStationId: z.coerce.number(),
	gasId: z.coerce.number(),
	fileId: z.number().optional(),
});

export const GasSupplyFormSchema = GasSupplyBaseSchema.extend({
	supplyAt: z.date("Data de abastecimento é obrigatória"),
	kmToReview: z.number().min(0, "Km para revisão é obrigatório"),
	kmToStop: z.number().min(0, "Km de parada é obrigatório"),
	quantity: z.number().min(0, "Quantidade de litros é obrigatória"),
	totalPrice: z.number().min(0, "Valor total é obrigatório"),
	gasStationId: z.string().min(1, "Posto de combustível é obrigatório"),
	gasId: z.string().min(1, "Combustível é obrigatório"),
	file: z.array(z.any()).optional(),
	fileId: z.string().optional(),
	vehicleId: z.string(),
});
