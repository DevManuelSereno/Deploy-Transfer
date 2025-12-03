"use client";

import type { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useDataTable } from "@/providers/data-table-provider";

export function DataTableRowSelect<TData>({ row }: { row: Row<TData> }) {
	return (
		<>
			<div
				className={cn(
					"hidden absolute top-0 bottom-0 start-0 w-[2px] bg-primary",
					row.getIsSelected() && "block",
				)}
			></div>
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Selecionar linha"
				className="cursor-pointer"
			/>
		</>
	);
}

export function DataTableRowSelectAll<TData>({
	table,
}: {
	table: Table<TData>;
}) {
	const { isLoading, recordCount } = useDataTable();

	return (
		<Checkbox
			disabled={isLoading || recordCount === 0}
			checked={
				table.getIsAllPageRowsSelected() ||
				(table.getIsSomePageRowsSelected() && "indeterminate")
			}
			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			aria-label="Selecionar tudo"
			className="cursor-pointer"
		/>
	);
}
