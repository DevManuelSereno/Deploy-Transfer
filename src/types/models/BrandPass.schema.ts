import * as z from "zod";

export const BrandPassSchema = z.object({
	// id  da marca do veículo
	IDB: z.number().int(),

	// Nome da marca do veículo (ex.: Toyota, Mercedes, Volkswagen)
	Title: z.string().max(100),
});

export type BrandPassType = z.infer<typeof BrandPassSchema>;
