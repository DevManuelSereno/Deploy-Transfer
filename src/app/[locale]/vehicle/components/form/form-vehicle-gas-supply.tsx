"use client";
import { useQuery } from "@tanstack/react-query";
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
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import {
	type GasSupplyColumnActions,
	getGasSupplyColumns,
} from "@/app/[locale]/vehicle/components/columns/columns-table-vehicle-gas-supply";
import { ModalDeleteGasSupply } from "@/app/[locale]/vehicle/components/modal/modal-delete-vehicle-gas-supply";
import { ModalFormGasSupply } from "@/app/[locale]/vehicle/components/modal/modal-form-vehicle-gas-supply";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { useGasSupplyFormContext } from "@/app/[locale]/vehicle/context/vehicle-gas-supply-context";
import type { GasSupplyData } from "@/app/[locale]/vehicle/types/types-vehicle-gas-supply";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/functions.api";
import { DataTableProvider } from "@/providers/data-table-provider";

export function FormGasSupply() {
	const t = useTranslations("VehiclePage.GasSupply");
	const tColumns = useTranslations("VehiclePage.GasSupply.columns");
	const { setEditingGasSupply } = useGasSupplyFormContext();
	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

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
	const [isModalFormOpen, setIsModalFormOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

	const handleForward = () => setTabPanel("tab-occurrence");

	const handleBack = () => setTabPanel("tab-documentation");

	const vehicleId = editingVehicle?.IDV;

	const { data: dataGasSupply, isLoading } = useQuery({
		queryKey: ["gas-supply-get", vehicleId],
		queryFn: ({ signal }) =>
			getData<GasSupplyData[]>({
				url: "/gasSupply",
				signal,
				query:
					`where.vehicleId=${vehicleId}&&include.file=true&&` +
					"include.gas&&include.gasStation=true",
			}),
		enabled: !!vehicleId,
	});

	const openEditModal = useCallback(
		(gasSupply: GasSupplyData) => {
			setEditingGasSupply(gasSupply);
			setIsModalFormOpen(true);
		},
		[setEditingGasSupply],
	);

	const handleOpenDeleteModal = useCallback(
		(gasSupply?: GasSupplyData) => {
			setEditingGasSupply(gasSupply);
			setIsModalDeleteOpen(true);
		},
		[setEditingGasSupply],
	);

	const actions: GasSupplyColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(
		() => getGasSupplyColumns(actions, tColumns as any),
		[actions, tColumns],
	);

	const tableData = useMemo(
		() => (isLoading ? Array(10).fill({}) : (dataGasSupply ?? [])),
		[isLoading, dataGasSupply],
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

	const table = useReactTable<GasSupplyData>({
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

	return (
		<div className="space-y-5 p-6">
			<DataTableProvider recordCount={20} table={table}>
				<DataTable />
			</DataTableProvider>
			<Button
				type="button"
				onClick={() => {
					setEditingGasSupply(undefined);
					setIsModalFormOpen(true);
				}}
			>
				{t("addButton")}
			</Button>

			<ModalFormGasSupply open={isModalFormOpen} setOpen={setIsModalFormOpen} />

			<ModalDeleteGasSupply
				open={isModalDeleteOpen}
				setOpen={setIsModalDeleteOpen}
			/>
		</div>
	);
}
