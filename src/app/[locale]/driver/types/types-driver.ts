import type { z } from "zod";
import type {
	DriverFormSchema,
	DriverPayloadSchema,
} from "@/app/[locale]/driver/validation/validation-driver";
import type { DriverType } from "@/types/models";

export type DriverPayload = z.infer<typeof DriverPayloadSchema>;
export type DriverForm = z.infer<typeof DriverFormSchema>;

export type DriverData = Omit<DriverType, "Password">;
