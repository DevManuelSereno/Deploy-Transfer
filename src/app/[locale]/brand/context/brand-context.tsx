"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { BrandData } from "@/app/[locale]/brand/types/types-brand";

type BrandFormContextValue = {
	editingBrand?: BrandData;
	setEditingBrand: (brand?: BrandData) => void;
};

const BrandFormContext = React.createContext<BrandFormContextValue | undefined>(
	undefined,
);

export function BrandFormProvider({ children }: { children: ReactNode }) {
	const [editingBrand, setEditingBrand] = React.useState<BrandData | undefined>(
		undefined,
	);

	const value = React.useMemo(
		() => ({
			editingBrand,
			setEditingBrand,
		}),
		[editingBrand],
	);

	return (
		<BrandFormContext.Provider value={value}>
			{children}
		</BrandFormContext.Provider>
	);
}

export function useBrandFormContext() {
	const ctx = React.useContext(BrandFormContext);
	if (!ctx) {
		throw new Error(
			"useBrandFormContext must be used within a BrandFormProvider",
		);
	}
	return ctx;
}
