"use client";

import type { RowData, Table } from "@tanstack/react-table";
import { createContext, type ReactNode, useContext } from "react";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
	// biome-ignore lint/correctness/noUnusedVariables: "off"
	interface ColumnMeta<TData extends RowData, TValue> {
		type?: string;
		headerTitle?: string;
		headerClassName?: string;
		cellClassName?: string;
		skeleton?: ReactNode;
		expandedContent?: (row: TData) => ReactNode;
		placeholder?: string;
		className?: string;
		commandPlaceholder?: string;
		options?: { label: string; value: string }[];
		formatOptions?: Intl.NumberFormatOptions;
		visibleFor?: string[];
	}
}

export interface DataTableContextProps<TData extends object> {
	props: DataTableProps<TData>;
	table: Table<TData>;
	recordCount: number;
	isLoading: boolean;
}

export interface DataTableProps<TData extends object> {
	className?: string;
	table?: Table<TData>;
	recordCount: number;
	children?: ReactNode;
	onRowClick?: (row: TData) => void;
	isLoading?: boolean;
	emptyMessage?: ReactNode | string;
	tableClassNames?: {
		base?: string;
		header?: string;
		headerRow?: string;
		headerSticky?: string;
		body?: string;
		bodyRow?: string;
	};
}

const DataTableContext = createContext<
	// biome-ignore lint/suspicious/noExplicitAny: "off"
	DataTableContextProps<any> | undefined
>(undefined);

function useDataTable() {
	const context = useContext(DataTableContext);
	if (!context) {
		throw new Error("useDataTable must be used within a DataTableProvider");
	}
	return context;
}

function DataTableProvider<TData extends object>({
	children,
	table,
	...props
}: DataTableProps<TData> & { table: Table<TData> }) {
	return (
		<DataTableContext.Provider
			value={{
				props,
				table,
				recordCount: props.recordCount,
				isLoading: props.isLoading || false,
			}}
		>
			{children}
		</DataTableContext.Provider>
	);
}

function DataTableContainer({
	children,
	className,
	border = false,
}: {
	children: ReactNode;
	className?: string;
	border?: boolean;
}) {
	const { recordCount } = useDataTable();
	const { ref } = useDragScroll<HTMLDivElement>({
		disabled: recordCount === 0,
	});

	return (
		<div
			ref={ref}
			data-slot="data-grid"
			className={cn(
				"relative w-full overflow-auto",
				border && "border border-border rounded-lg",
				className,
			)}
		>
			{children}
		</div>
	);
}

export { useDataTable, DataTableProvider, DataTableContainer };
