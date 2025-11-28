"use client";

import type { ReactNode } from "react";
import * as React from "react";
import type { DocumentationData } from "@/app/transfer/types/types-documentation";

type DocumentationFormContextValue = {
	editingDocumentation?: DocumentationData;
	setEditingDocumentation: (documentation?: DocumentationData) => void;
};

const DocumentationFormContext = React.createContext<
	DocumentationFormContextValue | undefined
>(undefined);

export function DocumentationFormProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [editingDocumentation, setEditingDocumentation] = React.useState<
		DocumentationData | undefined
	>(undefined);

	const value = React.useMemo(
		() => ({
			editingDocumentation,
			setEditingDocumentation,
		}),
		[editingDocumentation],
	);

	return (
		<DocumentationFormContext.Provider value={value}>
			{children}
		</DocumentationFormContext.Provider>
	);
}

export function useDocumentationFormContext() {
	const ctx = React.useContext(DocumentationFormContext);
	if (!ctx) {
		throw new Error(
			"useDocumentationFormContext must be used within a DocumentationFormProvider",
		);
	}
	return ctx;
}
