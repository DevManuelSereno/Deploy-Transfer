"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { DriverData } from "@/app/[locale]/driver/types/types-driver";

type DriverFormContextValue = {
	editingDriver?: DriverData;
	setEditingDriver: (driver?: DriverData) => void;
};

const DriverFormContext = React.createContext<
	DriverFormContextValue | undefined
>(undefined);

export function DriverFormProvider({ children }: { children: ReactNode }) {
	const [editingDriver, setEditingDriver] = React.useState<
		DriverData | undefined
	>(undefined);

	const value = React.useMemo(
		() => ({
			editingDriver,
			setEditingDriver,
		}),
		[editingDriver],
	);

	return (
		<DriverFormContext.Provider value={value}>
			{children}
		</DriverFormContext.Provider>
	);
}

export function useDriverFormContext() {
	const ctx = React.useContext(DriverFormContext);
	if (!ctx) {
		throw new Error(
			"useDriverFormContext must be used within a DriverFormProvider",
		);
	}
	return ctx;
}
