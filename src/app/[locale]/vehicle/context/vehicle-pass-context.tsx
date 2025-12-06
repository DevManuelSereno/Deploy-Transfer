"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { VehiclePassData } from "@/app/[locale]/vehicle/types/types-vehicle-pass";

type VehicleFormContextValue = {
	editingVehicle?: VehiclePassData;
	setEditingVehicle: (vehicle?: VehiclePassData) => void;
};

const VehicleFormContext = React.createContext<
	VehicleFormContextValue | undefined
>(undefined);

export function VehiclePassFormProvider({ children }: { children: ReactNode }) {
	const [editingVehicle, setEditingVehicle] = React.useState<
		VehiclePassData | undefined
	>(undefined);

	const value = React.useMemo(
		() => ({
			editingVehicle,
			setEditingVehicle,
		}),
		[editingVehicle],
	);

	return (
		<VehicleFormContext.Provider value={value}>
			{children}
		</VehicleFormContext.Provider>
	);
}

export function useVehiclePassFormContext() {
	const ctx = React.useContext(VehicleFormContext);
	if (!ctx) {
		throw new Error(
			"useVehicleFormContext must be used within a VehicleFormProvider",
		);
	}
	return ctx;
}
