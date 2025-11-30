import type { z } from "zod";
import type {
	ImageValueSchema,
	VehicleFormSchema,
	VehiclePayloadSchema,
} from "@/app/validation/validation-vehicle";
import type {
	BrandType,
	CategoryType,
	ClassificationType,
	CompanyType,
	StatusType,
	VehicleType,
} from "@/types/models";

export type VehiclePayload = z.infer<typeof VehiclePayloadSchema>;
export type VehicleForm = z.infer<typeof VehicleFormSchema>;

export type ImageValue = z.infer<typeof ImageValueSchema>;

export type VehicleData = VehicleType & {
	classification: ClassificationType;
	category: CategoryType;
	brand: BrandType;
	company: CompanyType;
	status: StatusType;
};
