import { z } from "zod";
import { FuelingSchema } from "@/types/models";

const FuelingBaseSchema = FuelingSchema.omit({
	IDF: true,
	CreatedAt: true,
	UpdatedAt: true,
});

export const FuelingPayloadSchema = FuelingBaseSchema.extend({
	VehicleId: z.coerce.number(),
	ProviderId: z.coerce.number(),
	DriverId: z.coerce.number(),
});

export const FuelingFormSchema = FuelingBaseSchema.extend({
	FuelingAt: z.string().min(1),
	DriverId: z.string().min(1),
	ProviderId: z.string().min(1),
	VehicleId: z.string().min(1),
	Fuel: z.string().min(1),
	Odometer: z.number().min(0.1),
	Total: z.number().min(0.01),
});
