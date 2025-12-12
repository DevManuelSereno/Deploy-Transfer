"use client";

import {
	type ColumnFiltersState,
	type ColumnPinningState,
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
import { LucidePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { FormBrand } from "@/app/[locale]/brand/components/form/form-brand";
import { ModalDeleteBrand } from "@/app/[locale]/brand/components/modal/modal-delete-brand";
import { ModalTableBrand } from "@/app/[locale]/brand/components/modal/modal-table-brand";
import { useBrandFormContext } from "@/app/[locale]/brand/context/brand-context";
import { useModalContext } from "@/app/[locale]/brand/context/modal-table-brand";
import type { BrandData } from "@/app/[locale]/brand/types/types-brand";
import { DataTable } from "@/components/data-table";
import { DataTableExport } from "@/components/data-table/data-table-export";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSearchInput } from "@/components/data-table/data-table-search-input";
import { DataTableUpdate } from "@/components/data-table/data-table-update";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OpenAiToolbar } from "@/components/ui/open-ai-toolbar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DataTableProvider } from "@/providers/data-table-provider";
import {
	type BrandColumnActions,
	getBrandColumns,
} from "../columns/columns-table-brand";

export default function TableBrand() {
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("BrandPage.Table.Columns");
	const { setEditingBrand } = useBrandFormContext();
	const { isModalEditOpen, setIsModalEditOpen } = useModalContext();

	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
		right: ["actions"],
	});

	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const openEditModal = useCallback(
		(brand: BrandData) => {
			setEditingBrand(brand);
			setIsModalEditOpen(true);
		},
		[setEditingBrand, setIsModalEditOpen],
	);

	const handleOpenDeleteModal = useCallback(
		(brand?: BrandData) => {
			setEditingBrand(brand);
			setIsModalDeleteOpen(true);
		},
		[setEditingBrand],
	);

	const actions: BrandColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(
		() => getBrandColumns(actions, tColumns as any),
		[actions, tColumns],
	);

	// const { data: dataBrand, isLoading } = useQuery({
	// 	queryKey: ["brand-get"],
	// 	queryFn: ({ signal }) =>
	// 		getData<BrandData[]>({
	// 			url: "/brand",
	// 			signal,
	// 		}),
	// });
	const dataBrand = [
		{
			IDB: 1,
			Title: "Toyota",
		},
		{
			IDB: 2,
			Title: "Mercedes-Benz",
		},
		{
			IDB: 3,
			Title: "Volkswagen",
		},
		{
			IDB: 4,
			Title: "Honda",
		},
		{
			IDB: 5,
			Title: "Chevrolet",
		},
		{
			IDB: 6,
			Title: "Ford",
		},
		{
			IDB: 7,
			Title: "Hyundai",
		},
		{
			IDB: 8,
			Title: "Fiat",
		},
		{
			IDB: 9,
			Title: "Renault",
		},
		{
			IDB: 10,
			Title: "BMW",
		},
	];

	// const tableData = useMemo(
	// 	() => (isLoading ? Array(30).fill({}) : (dataBrand ?? [])),
	// 	[isLoading, dataBrand],
	// )
	const tableData = useMemo(() => dataBrand ?? [], []);
	// const tableColumns = useMemo(
	// 	() =>
	// 		isLoading
	// 			? columns.map((column) => ({
	// 					...column,
	// 					cell: () => <Skeleton className="h-8 w-full rounded-lg" />,
	// 				}))
	// 			: columns,
	// 	[isLoading, columns],
	// );

	const table = useReactTable({
		data: tableData,
		columns: columns,
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
	return (
		<div className="flex flex-1 flex-col gap-6">
			<Card
				className={cn(
					"border-0 gap-0 p-0 shadow-custom! bg-[linear-gradient(to_bottom,#ffffff_0%,#fcfcfc_50%,#fafafa_100%)]",
					"dark:bg-[linear-gradient(to_top,#232323_0%,#1c1c1c_30%,#161616_100%)] dark:shadow-none dark:border",
					"dark:border-[#262626] overflow-hidden",
				)}
			>
				<div className="flex h-full border-b items-center py-4 justify-between gap-4 px-5">
					<div className="flex items-center gap-2">
						<OpenAiToolbar />
						<Separator
							orientation="vertical"
							className="data-[orientation=vertical]:w-px data-[orientation=vertical]:h-4 mx-0.5"
						/>
						<DataTableSearchInput
							value={globalFilter}
							onChangeValue={(filter) => setGlobalFilter(filter)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<DataTableUpdate />
						<DataTableExport />
						<Separator
							orientation="vertical"
							className="data-[orientation=vertical]:w-px data-[orientation=vertical]:h-4 mx-0.5"
						/>
						<Button onClick={() => setIsModalEditOpen(true)}>
							<LucidePlus />
							{tTable("addButton")}
						</Button>
					</div>
				</div>
				<DataTableProvider
					recordCount={tableData.length}
					table={table}
					isLoading={false}
				>
					<DataTable />
					<DataTablePagination />
				</DataTableProvider>
				<ModalTableBrand open={isModalEditOpen} setOpen={setIsModalEditOpen}>
					<FormBrand />
				</ModalTableBrand>
				<ModalDeleteBrand
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
