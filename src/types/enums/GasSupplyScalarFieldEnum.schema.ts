import * as z from "zod";

export const FuelingScalarFieldEnumSchema = z.enum([
	"id",
	"kmToReview",
	"kmToStop",
	"quantity",
	"supplyAt",
	"totalPrice",
	"receipt",
	"gasId",
	"vehicleId",
	"createdAt",
	"updatedAt",
]);

export type FuelingScalarFieldEnum = z.infer<
	typeof FuelingScalarFieldEnumSchema
>;
