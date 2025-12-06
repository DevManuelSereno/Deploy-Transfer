import type { z } from "zod";
import type {
	VehiclePassFormSchema,
	VehiclePassPayloadSchema,
} from "@/app/[locale]/vehicle/validation/validation-vehicle-pass";
import type { BrandType, VehiclePassType } from "@/types/models";

export type VehiclePassPayload = z.infer<typeof VehiclePassPayloadSchema>;
export type VehiclePassForm = z.infer<typeof VehiclePassFormSchema>;

export type VehiclePassData = VehiclePassType & {
	brand: BrandType;
	// company: CompanyType;
};
