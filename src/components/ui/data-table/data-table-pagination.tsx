import type {
	PaginationState,
	SortingState,
	Table,
} from "@tanstack/react-table";
import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export function DataTablePagination<TData>({
	table,
	paginationProps,
}: {
	table: Table<TData>;
	paginationProps: {
		rowsPerPage?: number[];
	};
}) {
	const rowsPerPage = paginationProps?.rowsPerPage ?? [5, 10, 15, 20];
	return (
		<div className="flex flex-col md:flex-row items-center justify-between flex-1 gap-2.5 border-t px-5 py-4">
			<div className="text-muted-foreground text-sm">
				{table.getSelectedRowModel().rows.length} de{" "}
				{table.getRowCount().toString()} linha(s) selecionadas.
			</div>
			<Select
				value={table.getState().pagination.pageSize.toString()}
				onValueChange={(value) => {
					table.setPageSize(Number(value));
				}}
			>
				<SelectTrigger size="sm">
					<SelectValue placeholder="Select number of results" />
				</SelectTrigger>
				<SelectContent className="[&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto">
					{rowsPerPage.map((pageSize) => (
						<SelectItem key={pageSize} value={pageSize.toString()}>
							{pageSize} / página
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div className="flex items-center gap-4">
				<div className="flex grow justify-end text-sm whitespace-nowrap">
					<p className="font-medium">
						Página {table.getState().pagination.pageIndex + 1} de{" "}
						{Math.floor(
							table.getRowCount() / table.getState().pagination.pageSize,
						) + 1}
					</p>
				</div>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="disabled:pointer-events-none disabled:opacity-50"
								onClick={() => table.firstPage()}
								disabled={!table.getCanPreviousPage()}
								aria-label="Ir para a primeira página"
							>
								<ChevronFirstIcon size={16} aria-hidden="true" />
							</Button>
						</PaginationItem>

						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="disabled:pointer-events-none disabled:opacity-50"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								aria-label="Ir para página anterior"
							>
								<ChevronLeftIcon size={16} aria-hidden="true" />
							</Button>
						</PaginationItem>

						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="disabled:pointer-events-none disabled:opacity-50"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								aria-label="Ir para próxima página"
							>
								<ChevronRightIcon size={16} aria-hidden="true" />
							</Button>
						</PaginationItem>

						<PaginationItem>
							<Button
								size="icon"
								variant="outline"
								className="disabled:pointer-events-none disabled:opacity-50"
								onClick={() => table.lastPage()}
								disabled={!table.getCanNextPage()}
								aria-label="Ir para última página"
							>
								<ChevronLastIcon size={16} aria-hidden="true" />
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
