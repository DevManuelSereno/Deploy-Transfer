import type { z } from "zod";
import type {
	FuelingFormSchema,
	FuelingPayloadSchema,
} from "@/app/[locale]/fueling/validation/validation-fueling";
import type { FuelingType } from "@/types/models";

export type FuelingPayload = z.infer<typeof FuelingPayloadSchema>;
export type FuelingForm = z.infer<typeof FuelingFormSchema>;

export type FuelingData = FuelingType;
