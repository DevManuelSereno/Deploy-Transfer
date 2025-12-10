import * as z from "zod";

export const BrandSchema = z.object({
	// id  da marca do veículo
	IDB: z.number().int(),

	// Nome da marca do veículo (ex.: Toyota, Mercedes, Volkswagen)
	Title: z.string().max(100),
});

export type BrandType = z.infer<typeof BrandSchema>;
