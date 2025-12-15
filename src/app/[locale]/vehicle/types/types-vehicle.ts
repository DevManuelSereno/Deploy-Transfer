import type { z } from "zod";
import type {
	VehicleFormSchema,
	VehiclePayloadSchema,
} from "@/app/[locale]/vehicle/validation/validation-vehicle";
import type { BrandType, CompanyType, VehicleType } from "@/types/models";

export type VehiclePayload = z.infer<typeof VehiclePayloadSchema>;
export type VehicleForm = z.infer<typeof VehicleFormSchema>;

export type VehicleData = VehicleType & {
	brand: string;
	company: string;
};
