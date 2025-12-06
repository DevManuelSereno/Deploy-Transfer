"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { getVehicleColumnsPass } from "@/app/[locale]/vehicle/components/columns/columns-table-vehicle-pass";
import { ModalDeleteVehiclePass } from "@/app/[locale]/vehicle/components/modal/modal-delete-vehicle-pass";
import { ModalTableVehiclePass } from "@/app/[locale]/vehicle/components/modal/modal-table-vehicle-pass";
import TabsVehiclePass from "@/app/[locale]/vehicle/components/tabs/tabs-vehicle-pass";
import { useModalContextPass } from "@/app/[locale]/vehicle/context/modal-table-vehicle-pass";
import { useVehiclePassFormContext } from "@/app/[locale]/vehicle/context/vehicle-pass-context";
import type { VehiclePassData } from "@/app/[locale]/vehicle/types/types-vehicle-pass";
import { DataTable } from "@/components/data-table";
import { DataTableExport } from "@/components/data-table/data-table-export";
import { DataTableSearchInput } from "@/components/data-table/data-table-search-input";
import { DataTableUpdate } from "@/components/data-table/data-table-update";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OpenAiToolbar } from "@/components/ui/open-ai-toolbar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/functions.api";
import { cn } from "@/lib/utils";
import { DataTableProvider } from "@/providers/data-table-provider";
import type { VehicleColumnActions } from "../columns/columns-table-vehicle-pass";

export default function TableVehiclePass() {
	const tFilters = useTranslations("VehiclePage.Table.Filters");
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("VehiclePage.Table.Columns");
	const { setEditingVehicle } = useVehiclePassFormContext();
	const { isModalEditOpen, setIsModalEditOpen, setTabPanel } =
		useModalContextPass();
	const queryClient = useQueryClient();

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
		(vehicle: VehiclePassData) => {
			setEditingVehicle(vehicle);
			setTabPanel("tab-general-data");
			setIsModalEditOpen(true);
		},
		[setEditingVehicle, setTabPanel, setIsModalEditOpen],
	);

	const handleOpenDeleteModal = useCallback(
		(vehicle?: VehiclePassData) => {
			setEditingVehicle(vehicle);
			setIsModalDeleteOpen(true);
		},
		[setEditingVehicle],
	);

	const actions: VehicleColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(
		() => getVehicleColumnsPass(actions, tColumns),
		[actions, tColumns],
	);

	const { data: dataVehicle, isLoading } = useQuery({
		queryKey: ["vehicle-get"],
		queryFn: ({ signal }) =>
			getData<VehiclePassData[]>({
				url: "/vehicle",
				signal,
				query:
					"include.classification=true&include.category=true" +
					"&&include.brand=true&&include.company&&include.status=true",
			}),
		select: (vehicleData) =>
			vehicleData.map((vehicle) => ({
				...vehicle,
				// company: vehicle.company.name,
				brand: vehicle.brand.name,
			})),
	});

	const tableData = useMemo(
		() => (isLoading ? Array(30).fill({}) : (dataVehicle ?? [])),
		[isLoading, dataVehicle],
	);
	const tableColumns = useMemo(
		() =>
			isLoading
				? columns.map((column) => ({
						...column,
						cell: () => <Skeleton className="h-8 w-full rounded-lg" />,
					}))
				: columns,
		[isLoading, columns],
	);

	const table = useReactTable<VehiclePassData>({
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

	const handleUpdate = () =>
		queryClient.invalidateQueries({
			queryKey: ["vehicle-get"],
		});

	return (
		<div className="flex flex-1 flex-col gap-6">
			<Card
				className={cn(
					"rounded-[14px] p-0 gap-0 overflow-hidden shadow-custom! border dark:border-[#262626]",
					"max-h-[calc(100dvh-var(--header-height))] md:max-h-[calc(100dvh-var(--header-height)-3rem)]",
					"min-[56rem]:max-h-[calc(100dvh-var(--header-height)-4rem)] dark:shadow-none",
				)}
			>
				<div className="flex h-full border-b items-center py-4 justify-between gap-4 px-5">
					<div className="flex items-center gap-2">
						<OpenAiToolbar />
						<DataTableSearchInput
							value={globalFilter}
							onChangeValue={(filter) => setGlobalFilter(filter)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<DataTableUpdate handleUpdate={handleUpdate} />
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
					isLoading={isLoading}
				>
					<DataTable />
				</DataTableProvider>
				<ModalTableVehiclePass
					open={isModalEditOpen}
					setOpen={setIsModalEditOpen}
				>
					<TabsVehiclePass />
				</ModalTableVehiclePass>
				<ModalDeleteVehiclePass
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
