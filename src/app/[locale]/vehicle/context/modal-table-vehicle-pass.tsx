"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type ReactNode, useCallback } from "react";
import { useVehiclePassFormContext } from "@/app/[locale]/vehicle/context/vehicle-pass-context";
import type { VehiclePassData } from "@/app/[locale]/vehicle/types/types-vehicle-pass";

type ModalContextValue = {
	isModalEditOpen: boolean;
	setIsModalEditOpen: (open: boolean) => void;
	openWithVehicle: (vehicle?: VehiclePassData) => void;
	tabPanel: string;
	setTabPanel: (value: string) => void;
};

const ModalContext = React.createContext<ModalContextValue | undefined>(
	undefined,
);

export function ModalTableVehiclePassProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = useQueryClient();
	const { setEditingVehicle } = useVehiclePassFormContext();
	const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

	const [tabPanel, setTabPanel] = React.useState("general-data");

	const openWithVehicle = React.useCallback(
		(vehicle?: VehiclePassData) => {
			setEditingVehicle(vehicle);
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
		}),
		[isModalEditOpen, openWithVehicle, tabPanel, _setIsModalOpen],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function useModalContextPass() {
	const ctx = React.useContext(ModalContext);
	if (!ctx) {
		throw new Error(
			"useModalContext must be used within a VehicleFormProvider",
		);
	}
	return ctx;
}
