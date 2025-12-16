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
import { ModalDeleteFueling } from "@/app/[locale]/fueling/components/modal/modal-delete-fueling";
import { useFuelingFormContext } from "@/app/[locale]/fueling/context/fueling-context";
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";
import {
	type FuelingColumnActions,
	getFuelingColumns,
} from "@/app/[locale]/vehicle/components/columns/columns-table-vehicle-fueling";
import { ModalFormFueling } from "@/app/[locale]/vehicle/components/modal/modal-form-vehicle-fueling";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/functions.api";
import { DataTableProvider } from "@/providers/data-table-provider";

export function FormFueling() {
	const t = useTranslations("VehiclePage.Fueling");
	const tColumns = useTranslations("FuelingPage.Table.Columns");
	const { setEditingFueling } = useFuelingFormContext();
	const { editingVehicle } = useVehicleFormContext();

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

	// const { data: dataFueling, isLoading } = useQuery({
	// 	queryKey: ["fueling-get", vehicleId],
	// 	queryFn: ({ signal }) =>
	// 		getData<FuelingData[]>({
	// 			url: "/fueling",
	// 			signal,
	// 			query:
	// 				`where.vehicleId=${vehicleId}&&include.file=true&&` +
	// 				"include.gas&&include.gasStation=true",
	// 		}),
	// 	enabled: !!vehicleId,
	// });

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

	// const tableData = useMemo(
	// 	() => (isLoading ? Array(5).fill({}) : (dataFueling ?? [])),
	// 	[isLoading, dataFueling],
	// );

	const dataFueling = [
		{
			IDF: 1,
			CreatedAt: "2025-01-10T08:15:00Z",
			UpdatedAt: "2025-01-10T08:15:00Z",
			FuelingAt: "2025-01-10T07:50:00Z",
			DriverId: 101,
			VehicleId: 201,
			ProviderId: 301,
			MaintenanceDue: 150000,
			Odometer: 148200,
			Fuel: "Diesel",
			Total: 420.75,
		},
		{
			IDF: 2,
			CreatedAt: "2025-01-15T09:30:00Z",
			UpdatedAt: "2025-01-15T09:30:00Z",
			FuelingAt: "2025-01-15T09:05:00Z",
			DriverId: 102,
			VehicleId: 202,
			ProviderId: 302,
			MaintenanceDue: null,
			Odometer: 52340,
			Fuel: "Gasolina",
			Total: 310.2,
		},
		{
			IDF: 3,
			CreatedAt: "2025-01-18T14:12:00Z",
			UpdatedAt: "2025-01-18T14:12:00Z",
			FuelingAt: "2025-01-18T13:55:00Z",
			DriverId: 103,
			VehicleId: 203,
			ProviderId: 301,
			MaintenanceDue: 80000,
			Odometer: 79210,
			Fuel: "Etanol",
			Total: 185.9,
		},
		{
			IDF: 4,
			CreatedAt: "2025-01-22T11:00:00Z",
			UpdatedAt: "2025-01-22T11:10:00Z",
			FuelingAt: "2025-01-22T10:40:00Z",
			DriverId: 104,
			VehicleId: 201,
			ProviderId: 303,
			MaintenanceDue: null,
			Odometer: 149050,
			Fuel: "Diesel",
			Total: 398.0,
		},
		{
			IDF: 5,
			CreatedAt: "2025-01-25T16:45:00Z",
			UpdatedAt: "2025-01-25T16:45:00Z",
			FuelingAt: "2025-01-25T16:20:00Z",
			DriverId: 105,
			VehicleId: 204,
			ProviderId: 302,
			MaintenanceDue: 60000,
			Odometer: 58730,
			Fuel: "Gasolina",
			Total: 275.6,
		},
		{
			IDF: 6,
			CreatedAt: "2025-02-01T08:05:00Z",
			UpdatedAt: "2025-02-01T08:05:00Z",
			FuelingAt: "2025-02-01T07:45:00Z",
			DriverId: 101,
			VehicleId: 205,
			ProviderId: 304,
			MaintenanceDue: null,
			Odometer: 120340,
			Fuel: "Diesel",
			Total: 455.3,
		},
		{
			IDF: 7,
			CreatedAt: "2025-02-03T13:20:00Z",
			UpdatedAt: "2025-02-03T13:20:00Z",
			FuelingAt: "2025-02-03T12:55:00Z",
			DriverId: 106,
			VehicleId: 206,
			ProviderId: 301,
			MaintenanceDue: 90000,
			Odometer: 88410,
			Fuel: "Etanol",
			Total: 198.4,
		},
		{
			IDF: 8,
			CreatedAt: "2025-02-07T17:10:00Z",
			UpdatedAt: "2025-02-07T17:10:00Z",
			FuelingAt: "2025-02-07T16:45:00Z",
			DriverId: 107,
			VehicleId: 202,
			ProviderId: 303,
			MaintenanceDue: null,
			Odometer: 53890,
			Fuel: "Gasolina",
			Total: 322.1,
		},
		{
			IDF: 9,
			CreatedAt: "2025-02-10T09:00:00Z",
			UpdatedAt: "2025-02-10T09:00:00Z",
			FuelingAt: "2025-02-10T08:35:00Z",
			DriverId: 102,
			VehicleId: 207,
			ProviderId: 304,
			MaintenanceDue: 110000,
			Odometer: 108450,
			Fuel: "Diesel",
			Total: 489.9,
		},
		{
			IDF: 10,
			CreatedAt: "2025-02-12T15:30:00Z",
			UpdatedAt: "2025-02-12T15:30:00Z",
			FuelingAt: "2025-02-12T15:05:00Z",
			DriverId: 108,
			VehicleId: 204,
			ProviderId: 302,
			MaintenanceDue: null,
			Odometer: 60210,
			Fuel: "Gasolina",
			Total: 290.75,
		},
		{
			IDF: 11,
			CreatedAt: "2025-02-15T10:40:00Z",
			UpdatedAt: "2025-02-15T10:40:00Z",
			FuelingAt: "2025-02-15T10:15:00Z",
			DriverId: 109,
			VehicleId: 208,
			ProviderId: 301,
			MaintenanceDue: 130000,
			Odometer: 127890,
			Fuel: "Diesel",
			Total: 512.6,
		},
	];

	const tableData = useMemo(() => dataFueling ?? [], []);

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

	const table = useReactTable<FuelingData>({
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
