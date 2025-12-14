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
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";
import {
	type FuelingColumnActions,
	getFuelingColumns,
} from "@/app/[locale]/vehicle/components/columns/columns-table-vehicle-fueling";
import { ModalDeleteFueling } from "@/app/[locale]/vehicle/components/modal/modal-delete-vehicle-fueling";
import { ModalFormFueling } from "@/app/[locale]/vehicle/components/modal/modal-form-vehicle-fueling";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { useFuelingFormContext } from "@/app/[locale]/vehicle/context/vehicle-fueling-context";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/functions.api";
import { DataTableProvider } from "@/providers/data-table-provider";

export function FormFueling() {
	const t = useTranslations("VehiclePage.Fueling");
	const tColumns = useTranslations("VehiclePage.Fueling.columns");
	const { setEditingFueling } = useFuelingFormContext();
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

	const vehicleId = editingVehicle?.IDV;

	const { data: dataFueling, isLoading } = useQuery({
		queryKey: ["fueling-get", vehicleId],
		queryFn: ({ signal }) =>
			getData<FuelingData[]>({
				url: "/fueling",
				signal,
				query:
					`where.vehicleId=${vehicleId}&&include.file=true&&` +
					"include.gas&&include.gasStation=true",
			}),
		enabled: !!vehicleId,
	});

	const openEditModal = useCallback(
		(fueling: FuelingData) => {
			setEditingFueling(fueling);
			setIsModalFormOpen(true);
		},
		[setEditingFueling],
	);

	const handleOpenDeleteModal = useCallback(
		(fueling?: FuelingData) => {
			setEditingFueling(fueling);
			setIsModalDeleteOpen(true);
		},
		[setEditingFueling],
	);

	const actions: FuelingColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(
		() => getFuelingColumns(actions, tColumns as any),
		[actions, tColumns],
	);

	const tableData = useMemo(
		() => (isLoading ? Array(5).fill({}) : (dataFueling ?? [])),
		[isLoading, dataFueling],
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

	const table = useReactTable<FuelingData>({
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
					setEditingFueling(undefined);
					setIsModalFormOpen(true);
				}}
			>
				{t("addButton")}
			</Button>

			<ModalFormFueling open={isModalFormOpen} setOpen={setIsModalFormOpen} />

			<ModalDeleteFueling
				open={isModalDeleteOpen}
				setOpen={setIsModalDeleteOpen}
			/>
		</div>
	);
}
