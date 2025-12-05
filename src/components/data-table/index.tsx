/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { flexRender } from "@tanstack/react-table";
import type { ReactNode } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
	DataTableContainer,
	useDataTable,
} from "@/providers/data-table-provider";
import { DataTableColumnCell } from "./data-table-column-cell";
import { DataTableColumnHead } from "./data-table-column-head";

interface DataTableProps {
	emptyState?: ReactNode;
}

export function DataTable({ emptyState }: DataTableProps) {
	const { props, table, isLoading } = useDataTable();
	const pagination = table.getState().pagination;

	const renderEmptyState = () => (
		<TableRow>
			<TableCell
				colSpan={table.getAllColumns().length}
				className={cn(
					"text-center h-24 flex items-center justify-center w-full",
				)}
			>
				{emptyState ?? "Nenhum registro encontrado"}
			</TableCell>
		</TableRow>
	);

	return (
		<DataTableContainer>
			<Table className="relative grid border-separate border-spacing-0 [&_td]:border-border [&_th]:border-border [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
				<TableHeader
					className={cn(
						"bg-background/90 dark:bg-[#161616]/90 sticky top-0 z-10 rounded-t-xl backdrop-blur-xs",
						props.tableClassNames?.header,
					)}
				>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow className="flex w-full" key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<DataTableColumnHead key={header.id} header={header}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</DataTableColumnHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="grid">
					{isLoading && pagination?.pageSize
						? Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
								<TableRow key={rowIndex} className="flex w-full">
									{table.getVisibleFlatColumns().map((column, colIndex) => {
										if (column.id === "actions") {
											return null;
										}
										return (
											<TableCell
												key={colIndex}
												className={cn(
													"flex items-center h-12",
													column.columnDef.meta?.cellClassName,
												)}
												style={{ width: `${column.getSize()}px` }}
											>
												{column.columnDef.meta?.skeleton}
											</TableCell>
										);
									})}
								</TableRow>
							))
						: table.getRowModel().rows?.length
							? table.getRowModel().rows.map((row) => (
									<TableRow
										className="flex w-full group/table"
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => {
											return <DataTableColumnCell key={cell.id} cell={cell} />;
										})}
									</TableRow>
								))
							: renderEmptyState()}
				</TableBody>
			</Table>
		</DataTableContainer>
	);
}
