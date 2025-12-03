"use client";

import type { Table as TanstackTable } from "@tanstack/react-table";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type ColumnPinningState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	paginationProps?: {
		initialRowsPerPage?: number;
		rowsPerPage?: number[];
	};
	loading?: boolean;
	topLeftActions?:
		| React.ReactNode
		| ((table: TanstackTable<TData>) => React.ReactNode);
	topRightActions?: React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	paginationProps,
	topLeftActions,
	topRightActions,
	loading = false,
}: DataTableProps<TData, TValue>) {
	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: paginationProps?.initialRowsPerPage ?? 10,
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
		right: ["actions"],
	});

	// const placeholderText = useMemo(() => {
	// 	const headerTexts = columns
	// 		.filter(
	// 			(col) =>
	// 				col.enableColumnFilter === true && (col.meta as any)?.headerText,
	// 		)
	// 		.map((col) => (col.meta as any).headerText); // Usamos 'as any' para funcionar mesmo sem a etapa de tipagem
	//
	// 	if (headerTexts.length === 0) {
	// 		return "Filtrar tudo...";
	// 	}
	//
	// 	return `Buscar por ${headerTexts.join(", ")}...`;
	// }, [columns]);

	const tableData = useMemo(
		() => (loading ? Array(30).fill({}) : data),
		[loading, data],
	);
	const tableColumns = useMemo(
		() =>
			loading
				? columns.map((column) => ({
						...column,
						cell: () => <Skeleton className="h-8 w-full rounded-lg" />,
					}))
				: columns,
		[loading, columns],
	);

	const table = useReactTable<TData>({
		data: tableData,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnPinningChange: setColumnPinning,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			pagination,
			columnPinning,
			globalFilter,
		},
	});

	const resolvedLeftActions =
		typeof topLeftActions === "function"
			? topLeftActions(table)
			: topLeftActions;

	const hasActions = resolvedLeftActions || topRightActions;

	return (
		<>
			{hasActions ? (
				<div className="flex h-full border-b items-center py-4 justify-between gap-4 px-5">
					{resolvedLeftActions}
					{topRightActions}
				</div>
			) : null}

			<Table
				className={cn(
					"w-full caption-bottom text-sm relative grid border-separate",
					"border-spacing-0 [&_td]:border-border [&_th]:border-border [&_th]:border-b",
					"[&_tr:not(:last-child)_td]:border-b [&_tr]:border-none cursor-grab select-none overscroll-x-contain scroll-smooth",
				)}
			>
				<TableHeader className="sticky top-0 z-10 rounded-t-xl backdrop-blur-xs">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className="hover:bg-transparent flex w-full"
						>
							{headerGroup.headers.map((header) => {
								const pinSide = header.column.getIsPinned(); // "left" | "right" | false
								const isPinned = pinSide !== false;
								const pinnedIds = isPinned
									? (table.getState().columnPinning[pinSide] ?? [])
									: [];
								const isLastPinned =
									isPinned &&
									pinnedIds[pinnedIds.length - 1] === header.column.id;

								return (
									<TableHead
										key={header.id}
										data-pinned={isPinned ? pinSide : undefined}
										data-last-col={isLastPinned ? pinSide : undefined}
										style={{ width: `${header.getSize()}px` }}
										className={cn(
											"text-foreground text-left align-middle font-medium whitespace-nowrap",
											"[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] relative flex",
											"items-center h-10 truncate px-3",
											"[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0",
											"[&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0",
											"[&[data-pinned=left][data-last-col=left]]:border-r",
											"[&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0",
											"[&[data-pinned][data-last-col]]:border-border",
											// "data-pinned:backdrop-blur-xs",
											pinSide === "right" && "sticky right-0 z-10",
											header.column.id !== "id" &&
												header.column.id !== "select" &&
												pinSide !== "right" &&
												"grow",
											!isPinned && "relative",
										)}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="grid">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className={cn(
									"hover:bg-muted/40 data-[state=selected]:bg-muted",
									"border-b transition-colors flex w-full group/table",
								)}
							>
								{row.getVisibleCells().map((cell) => {
									const pinSide = cell.column.getIsPinned(); // "left" | "right" | false
									const isPinned = pinSide !== false;
									const pinnedIds = isPinned
										? (table.getState().columnPinning[pinSide] ?? [])
										: [];
									const isLastPinned =
										isPinned &&
										pinnedIds[pinnedIds.length - 1] === cell.column.id;
									return (
										<TableCell
											key={cell.id}
											data-pinned={isPinned ? pinSide : undefined}
											data-last-col={isLastPinned ? pinSide : undefined}
											title={
												typeof cell.getValue() === "string"
													? String(cell.getValue())
													: undefined
											}
											className={cn(
												"px-3 overflow-hidden text-ellipsis",
												"flex items-center [&[data-pinned=left][data-last-col=left]]:border-r",
												"[&[data-pinned][data-last-col]]:border-border",
												// "data-pinned:backdrop-blur-xs",
												pinSide === "right" && "sticky right-0 z-10",
												cell.column.id !== "id" &&
													cell.column.id !== "select" &&
													pinSide !== "right" &&
													"grow",
												!pinSide && "relative",
												isLastPinned && "group/table:hover:bg-foreground",
											)}
											style={{
												width: `${cell.column.getSize()}px`,
											}}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-center h-24 flex items-center justify-center w-full"
							>
								Nenhum registro encontrado
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<DataTablePagination
				table={table}
				paginationProps={{ rowsPerPage: paginationProps?.rowsPerPage }}
			/>
		</>
	);
}
