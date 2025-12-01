"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { OccurrenceData } from "@/app/vehicle/types/types-occurrence";

type OccurrenceFormContextValue = {
	editingOccurrence?: OccurrenceData;
	setEditingOccurrence: (occurrence?: OccurrenceData) => void;
};

const OccurrenceFormContext = React.createContext<
	OccurrenceFormContextValue | undefined
>(undefined);

export function OccurrenceFormProvider({ children }: { children: ReactNode }) {
	const [editingOccurrence, setEditingOccurrence] = React.useState<
		OccurrenceData | undefined
	>(undefined);

	const value = React.useMemo(
		() => ({
			editingOccurrence,
			setEditingOccurrence,
		}),
		[editingOccurrence],
	);

	return (
		<OccurrenceFormContext.Provider value={value}>
			{children}
		</OccurrenceFormContext.Provider>
	);
}

export function useOccurrenceFormContext() {
	const ctx = React.useContext(OccurrenceFormContext);
	if (!ctx) {
		throw new Error(
			"useOccurrenceFormContext must be used within a OccurrenceFormProvider",
		);
	}
	return ctx;
}
