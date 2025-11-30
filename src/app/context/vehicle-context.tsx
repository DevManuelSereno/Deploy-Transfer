"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { VehicleData } from "@/app/types/types-vehicle";

type VehicleFormContextValue = {
	editingVehicle?: VehicleData;
	setEditingVehicle: (vehicle?: VehicleData) => void;
};

const VehicleFormContext = React.createContext<
	VehicleFormContextValue | undefined
>(undefined);

export function VehicleFormProvider({ children }: { children: ReactNode }) {
	const [editingVehicle, setEditingVehicle] = React.useState<
		VehicleData | undefined
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

export function useVehicleFormContext() {
	const ctx = React.useContext(VehicleFormContext);
	if (!ctx) {
		throw new Error(
			"useVehicleFormContext must be used within a VehicleFormProvider",
		);
	}
	return ctx;
}
