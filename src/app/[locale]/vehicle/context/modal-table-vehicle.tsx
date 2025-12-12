"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type ReactNode, useCallback } from "react";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import type { VehicleData } from "@/app/[locale]/vehicle/types/types-vehicle";

type ModalContextValue = {
	isModalEditOpen: boolean;
	setIsModalEditOpen: (open: boolean) => void;
	openWithVehicle: (vehicle?: VehicleData) => void;
	tabPanel: string;
	setTabPanel: (value: string) => void;
	showTabs: boolean;
	setShowTabs: (value: boolean) => void;
};

const ModalContext = React.createContext<ModalContextValue | undefined>(
	undefined,
);

export function ModalTableVehicleProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = useQueryClient();
	const { setEditingVehicle } = useVehicleFormContext();
	const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

	const [tabPanel, setTabPanel] = React.useState("tab-general-data");
	const [showTabs, setShowTabs] = React.useState(false);

	const openWithVehicle = React.useCallback(
		(vehicle?: VehicleData) => {
			setEditingVehicle(vehicle);
			// Show tabs immediately when editing, hide when adding new
			setShowTabs(!!vehicle);
			setIsModalEditOpen(true);
		},
		[setEditingVehicle],
	);

	const _setIsModalOpen = useCallback(
		async (open: boolean) => {
			setIsModalEditOpen(open);
			if (!open) {
				setEditingVehicle(undefined);
				setTabPanel("tab-general-data");
				setShowTabs(false);
				await queryClient.invalidateQueries({ queryKey: ["vehicle-get"] });
			}
		},
		[queryClient, setEditingVehicle],
	);

	const value = React.useMemo(
		() => ({
			isModalEditOpen,
			setIsModalEditOpen: _setIsModalOpen,
			openWithVehicle,
			tabPanel,
			setTabPanel,
			showTabs,
			setShowTabs,
		}),
		[isModalEditOpen, openWithVehicle, tabPanel, showTabs, _setIsModalOpen],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function useModalContext() {
	const ctx = React.useContext(ModalContext);
	if (!ctx) {
		throw new Error(
			"useModalContext must be used within a VehicleFormProvider",
		);
	}
	return ctx;
}
