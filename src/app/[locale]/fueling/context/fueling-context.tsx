"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";

type FuelingFormContextValue = {
	editingFueling?: FuelingData;
	setEditingFueling: (fueling?: FuelingData) => void;
};

const FuelingFormContext = React.createContext<
	FuelingFormContextValue | undefined
>(undefined);

export function FuelingFormProvider({ children }: { children: ReactNode }) {
	const [editingFueling, setEditingFueling] = React.useState<
		FuelingData | undefined
	>(undefined);

	const value = React.useMemo(
		() => ({
			editingFueling,
			setEditingFueling,
		}),
		[editingFueling],
	);

	return (
		<FuelingFormContext.Provider value={value}>
			{children}
		</FuelingFormContext.Provider>
	);
}

export function useFuelingFormContext() {
	const ctx = React.useContext(FuelingFormContext);
	if (!ctx) {
		throw new Error(
			"useFuelingFormContext must be used within a FuelingFormProvider",
		);
	}
	return ctx;
}
