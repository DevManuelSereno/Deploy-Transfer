import { z } from "zod";
import { BrandSchema } from "@/types/models";

const BrandBaseSchema = BrandSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const BrandPayloadSchema = BrandBaseSchema;

export const BrandFormSchema = BrandBaseSchema.extend({
	name: z.string().min(1, "Nome é obrigatório"),
});
