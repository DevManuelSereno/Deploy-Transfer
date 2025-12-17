"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type ReactNode, useCallback } from "react";
import { useDriverFormContext } from "@/app/[locale]/driver/context/driver-context";
import type { DriverData } from "@/app/[locale]/driver/types/types-driver";

type ModalContextValue = {
	isModalEditOpen: boolean;
	setIsModalEditOpen: (open: boolean) => void;
	openWithDriver: (driver?: DriverData) => void;
};

const ModalContext = React.createContext<ModalContextValue | undefined>(
	undefined,
);

export function ModalTableDriverProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = useQueryClient();
	const { setEditingDriver } = useDriverFormContext();
	const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

	const openWithDriver = React.useCallback(
		(driver?: DriverData) => {
			setEditingDriver(driver);
			setIsModalEditOpen(true);
		},
		[setEditingDriver],
	);

	const _setIsModalOpen = useCallback(
		async (open: boolean) => {
			setIsModalEditOpen(open);
			if (!open) {
				setEditingDriver(undefined);
				await queryClient.invalidateQueries({ queryKey: ["driver-get"] });
			}
		},
		[queryClient, setEditingDriver],
	);

	const value = React.useMemo(
		() => ({
			isModalEditOpen,
			setIsModalEditOpen: _setIsModalOpen,
			openWithDriver,
		}),
		[isModalEditOpen, openWithDriver, _setIsModalOpen],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function useModalContext() {
	const ctx = React.useContext(ModalContext);
	if (!ctx) {
		throw new Error(
			"useModalContext must be used within a DriverFormProvider",
		);
	}
	return ctx;
}
