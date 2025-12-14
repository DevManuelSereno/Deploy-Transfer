import type { z } from "zod";
import type {
	FuelingFormSchema,
	FuelingPayloadSchema,
} from "@/app/[locale]/fueling/validation/validation-fueling";

export type FuelingPayload = z.infer<typeof FuelingPayloadSchema>;
export type FuelingForm = z.infer<typeof FuelingFormSchema>;

export type FuelingData = {
	IDF: number;
	VehicleId: number;
	VehiclePlate: string;
	Date: string;
	Liters: number;
	PricePerLiter: number;
	TotalCost: number;
	Odometer: number;
	FuelType: string;
	Station: string;
	Location: string;
	Driver?: string;
	Notes?: string;
	CreatedAt: string;
	UpdatedAt: string;
};
