import type { z } from "zod";
import type {
	FileValueSchema,
	GasSupplyFormSchema,
	GasSupplyPayloadSchema,
} from "@/app/vehicle/validation/validation-gas-supply";
import type { GasStationType, GasSupplyType, GasType } from "@/types/models";
import type { FileType } from "@/types/models/File.schema";

export type GasSupplyPayload = z.infer<typeof GasSupplyPayloadSchema>;
export type GasSupplyForm = z.infer<typeof GasSupplyFormSchema>;

export type FileValue = z.infer<typeof FileValueSchema>;

export type GasSupplyData = Omit<GasSupplyType, "supplyAt"> & {
	supplyAt: string;
	file?: FileType | null;
	gasStation: GasStationType;
	gas: GasType;
};
