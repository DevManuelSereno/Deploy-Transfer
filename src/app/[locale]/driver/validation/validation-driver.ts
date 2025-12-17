import { z } from "zod";
import { DriverSchema } from "@/types/models";

const DriverBaseSchema = DriverSchema.omit({
	IDD: true,
	Password: true,
	CreatedAt: true,
	UpdatedAt: true,
});

export const DriverPayloadSchema = DriverBaseSchema.extend({
	// DriverAt: z.iso.datetime(),
});

export const DriverFormSchema = DriverBaseSchema.extend({
	FirstName: z.string().min(1),
	// Severity: z.string().min(1),
	// DriverAt: z.string().datetime(),
});
