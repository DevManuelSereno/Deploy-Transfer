"use client";

import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/providers/data-table-provider";

export function DataTablePagination() {
	const { table, isLoading, recordCount } = useDataTable();
	const t = useTranslations("DataTable.DataTablePagination");

	return (
		<div className="flex flex-col md:flex-row items-center justify-between flex-1 gap-2.5 border-t px-5 py-4">
			{!isLoading && table.getFilteredRowModel().rows.length > 0 && (
				<div className="text-muted-foreground text-sm">
					{t("selectedRows", {
						count: table.getFilteredSelectedRowModel().rows.length,
						total: table.getFilteredRowModel().rows.length,
					})}
				</div>
			)}

			{isLoading ? (
				<Skeleton className="h-8 w-[120px]" />
			) : (
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger size="sm" disabled={recordCount === 0}>
						<SelectValue placeholder={table.getState().pagination.pageSize} />
					</SelectTrigger>
					<SelectContent side="top">
						{[5, 10, 15, 20].map((pageSize) => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{t("rowsPerPage", { count: pageSize })}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}

			<div className="flex items-center gap-4">
				{isLoading ? null : (
					<p className="font-medium text-sm">
						{t("page", {
							current: table.getState().pagination.pageIndex + 1,
							total: table.getPageCount(),
						})}
					</p>
				)}
				<Pagination className="w-fit">
					<PaginationContent>
						{isLoading ? (
							<Skeleton className="w-[210px] h-8" />
						) : (
							<>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="size-8"
										onClick={() => table.firstPage()}
										disabled={!table.getCanPreviousPage()}
										aria-label={t("firstPage")}
									>
										<ChevronFirstIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="size-8"
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
										aria-label={t("previousPage")}
									>
										<ChevronLeftIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="size-8"
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
										aria-label={t("nextPage")}
									>
										<ChevronRightIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="size-8"
										onClick={() => table.lastPage()}
										disabled={!table.getCanNextPage()}
										aria-label={t("lastPage")}
									>
										<ChevronLastIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
							</>
						)}
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
