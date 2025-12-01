"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type ReactNode, useCallback } from "react";
import { useBrandFormContext } from "@/app/[locale]/brand/context/brand-context";
import type { BrandData } from "@/app/[locale]/brand/types/types-brand";

type ModalContextValue = {
	isModalEditOpen: boolean;
	setIsModalEditOpen: (open: boolean) => void;
	openWithBrand: (brand?: BrandData) => void;
};

const ModalContext = React.createContext<ModalContextValue | undefined>(
	undefined,
);

export function ModalTableBrandProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();
	const { setEditingBrand } = useBrandFormContext();
	const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

	const openWithBrand = React.useCallback(
		(brand?: BrandData) => {
			setEditingBrand(brand);
			setIsModalEditOpen(true);
		},
		[setEditingBrand],
	);

	const _setIsModalOpen = useCallback(
		async (open: boolean) => {
			setIsModalEditOpen(open);
			if (!open) {
				setEditingBrand(undefined);
				await queryClient.invalidateQueries({ queryKey: ["brand-get"] });
			}
		},
		[queryClient, setEditingBrand],
	);

	const value = React.useMemo(
		() => ({
			isModalEditOpen,
			setIsModalEditOpen: _setIsModalOpen,
			openWithBrand,
		}),
		[isModalEditOpen, openWithBrand, _setIsModalOpen],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function useModalContext() {
	const ctx = React.useContext(ModalContext);
	if (!ctx) {
		throw new Error("useModalContext must be used within a BrandFormProvider");
	}
	return ctx;
}
