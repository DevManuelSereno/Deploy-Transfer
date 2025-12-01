import type { z } from "zod";
import type {
	BrandFormSchema,
	BrandPayloadSchema,
} from "@/app/brand/validation/validation-brand";
import type { BrandType } from "@/types/models";

export type BrandPayload = z.infer<typeof BrandPayloadSchema>;
export type BrandForm = z.infer<typeof BrandFormSchema>;

export type BrandData = BrandType;
