import { z } from "zod";
import { BrandPassSchema, BrandSchema } from "@/types/models";

const BrandBaseSchema = BrandSchema.omit({
	IDB: true,
});

export const BrandPayloadSchema = BrandBaseSchema;

export const BrandFormSchema = BrandBaseSchema.extend({
	Title: z.string().min(1, "Nome é obrigatório"),
});
