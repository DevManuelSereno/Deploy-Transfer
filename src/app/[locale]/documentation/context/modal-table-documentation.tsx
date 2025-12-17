"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { type ReactNode, useCallback } from "react";
import { useDocumentationFormContext } from "@/app/[locale]/documentation/context/documentation-context";
import type { DocumentationData } from "@/app/[locale]/documentation/types/types-documentation";

type ModalContextValue = {
	isModalEditOpen: boolean;
	setIsModalEditOpen: (open: boolean) => void;
	openWithDocumentation: (documentation?: DocumentationData) => void;
	tabPanel: string;
	setTabPanel: (value: string) => void;
	showTabs: boolean;
	setShowTabs: (value: boolean) => void;
};

const ModalContext = React.createContext<ModalContextValue | undefined>(
	undefined,
);

export function ModalTableDocumentationProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = useQueryClient();
	const { setEditingDocumentation } = useDocumentationFormContext();
	const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

	const [tabPanel, setTabPanel] = React.useState("tab-general-data");
	const [showTabs, setShowTabs] = React.useState(false);

	const openWithDocumentation = React.useCallback(
		(documentation?: DocumentationData) => {
			setEditingDocumentation(documentation);
			setShowTabs(!!documentation);
			setIsModalEditOpen(true);
		},
		[setEditingDocumentation],
	);

	const _setIsModalOpen = useCallback(
		async (open: boolean) => {
			setIsModalEditOpen(open);
			if (!open) {
				setEditingDocumentation(undefined);
				setTabPanel("tab-general-data");
				setShowTabs(false);
				await queryClient.invalidateQueries({ queryKey: ["documentation-get"] });
			}
		},
		[queryClient, setEditingDocumentation],
	);

	const value = React.useMemo(
		() => ({
			isModalEditOpen,
			setIsModalEditOpen: _setIsModalOpen,
			openWithDocumentation,
			tabPanel,
			setTabPanel,
			showTabs,
			setShowTabs,
		}),
		[isModalEditOpen, openWithDocumentation, tabPanel, showTabs, _setIsModalOpen],
	);

	return (
		<ModalContext.Provider value={value}>{children}</ModalContext.Provider>
	);
}

export function useModalContext() {
	const ctx = React.useContext(ModalContext);
	if (!ctx) {
		throw new Error(
			"useModalContext must be used within a DocumentationFormProvider",
		);
	}
	return ctx;
}
