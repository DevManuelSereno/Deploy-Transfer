"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type ReactNode, useCallback } from "react";
import { useOccurrenceFormContext } from "@/app/[locale]/occurrence/context/occurrence-context";
import type { OccurrenceData } from "@/app/[locale]/occurrence/types/types-occurrence";

type ModalContextValue = {
	isModalEditOpen: boolean;
	setIsModalEditOpen: (open: boolean) => void;
	openWithOccurrence: (occurrence?: OccurrenceData) => void;
};

const ModalContext = React.createContext<ModalContextValue | undefined>(
	undefined,
);

export function ModalTableOccurrenceProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = useQueryClient();
	const { setEditingOccurrence } = useOccurrenceFormContext();
	const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

	const openWithOccurrence = React.useCallback(
		(occurrence?: OccurrenceData) => {
			setEditingOccurrence(occurrence);
			setIsModalEditOpen(true);
		},
		[setEditingOccurrence],
	);

	const _setIsModalOpen = useCallback(
		async (open: boolean) => {
			setIsModalEditOpen(open);
			if (!open) {
				setEditingOccurrence(undefined);
				await queryClient.invalidateQueries({ queryKey: ["occurrence-get"] });
			}
		},
		[queryClient, setEditingOccurrence],
	);

	const value = React.useMemo(
		() => ({
			isModalEditOpen,
			setIsModalEditOpen: _setIsModalOpen,
			openWithOccurrence,
		}),
		[isModalEditOpen, openWithOccurrence, _setIsModalOpen],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function useModalContext() {
	const ctx = React.useContext(ModalContext);
	if (!ctx) {
		throw new Error(
			"useModalContext must be used within a OccurrenceFormProvider",
		);
	}
	return ctx;
}
