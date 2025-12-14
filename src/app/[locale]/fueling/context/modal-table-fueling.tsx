"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type ReactNode, useCallback } from "react";
import { useFuelingFormContext } from "@/app/[locale]/fueling/context/fueling-context";
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";

type ModalContextValue = {
	isModalEditOpen: boolean;
	setIsModalEditOpen: (open: boolean) => void;
	openWithFueling: (fueling?: FuelingData) => void;
	tabPanel: string;
	setTabPanel: (value: string) => void;
	showTabs: boolean;
	setShowTabs: (value: boolean) => void;
};

const ModalContext = React.createContext<ModalContextValue | undefined>(
	undefined,
);

export function ModalTableFuelingProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = useQueryClient();
	const { setEditingFueling } = useFuelingFormContext();
	const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

	const [tabPanel, setTabPanel] = React.useState("tab-general-data");
	const [showTabs, setShowTabs] = React.useState(false);

	const openWithFueling = React.useCallback(
		(fueling?: FuelingData) => {
			setEditingFueling(fueling);
			setShowTabs(!!fueling);
			setIsModalEditOpen(true);
		},
		[setEditingFueling],
	);

	const _setIsModalOpen = useCallback(
		async (open: boolean) => {
			setIsModalEditOpen(open);
			if (!open) {
				setEditingFueling(undefined);
				setTabPanel("tab-general-data");
				setShowTabs(false);
				await queryClient.invalidateQueries({ queryKey: ["fueling-get"] });
			}
		},
		[queryClient, setEditingFueling],
	);

	const value = React.useMemo(
		() => ({
			isModalEditOpen,
			setIsModalEditOpen: _setIsModalOpen,
			openWithFueling,
			tabPanel,
			setTabPanel,
			showTabs,
			setShowTabs,
		}),
		[isModalEditOpen, openWithFueling, tabPanel, showTabs, _setIsModalOpen],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function useModalContext() {
	const ctx = React.useContext(ModalContext);
	if (!ctx) {
		throw new Error(
			"useModalContext must be used within a FuelingFormProvider",
		);
	}
	return ctx;
}
