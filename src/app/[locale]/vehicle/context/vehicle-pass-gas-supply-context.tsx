"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { GasSupplyData } from "@/app/[locale]/vehicle/types/types-vehicle-pass-gas-supply";

type GasSupplyFormContextValue = {
	editingGasSupply?: GasSupplyData;
	setEditingGasSupply: (gasSupply?: GasSupplyData) => void;
};

const GasSupplyFormContext = React.createContext<
	GasSupplyFormContextValue | undefined
>(undefined);

export function GasSupplyFormProvider({ children }: { children: ReactNode }) {
	const [editingGasSupply, setEditingGasSupply] = React.useState<
		GasSupplyData | undefined
	>(undefined);

	const value = React.useMemo(
		() => ({
			editingGasSupply,
			setEditingGasSupply,
		}),
		[editingGasSupply],
	);

	return (
		<GasSupplyFormContext.Provider value={value}>
			{children}
		</GasSupplyFormContext.Provider>
	);
}

export function useGasSupplyFormContext() {
	const ctx = React.useContext(GasSupplyFormContext);
	if (!ctx) {
		throw new Error(
			"useGasSupplyFormContext must be used within a GasSupplyFormProvider",
		);
	}
	return ctx;
}