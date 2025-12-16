"use client";

import { useQueryClient } from "@tanstack/react-query";
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
import { BusIcon, CarFrontIcon, LucidePlus, Fuel, FuelIcon, DollarSignIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { getFuelingColumns } from "@/app/[locale]/fueling/components/columns/columns-table-fueling";
import { FormFuelingData } from "@/app/[locale]/fueling/components/form/form-fueling-data";
import { ModalDeleteFueling } from "@/app/[locale]/fueling/components/modal/modal-delete-fueling";
import { ModalTableFueling } from "@/app/[locale]/fueling/components/modal/modal-table-fueling";
import { useFuelingFormContext } from "@/app/[locale]/fueling/context/fueling-context";
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSearchInput } from "@/components/data-table/data-table-search-input";
// import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarouselCardInsight } from "@/components/ui/carousel-card-insight";
import { OpenAiToolbar } from "@/components/ui/open-ai-toolbar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DataTableProvider } from "@/providers/data-table-provider";
import type { FuelingColumnActions } from "../columns/columns-table-fueling";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default function TableFueling() {
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("FuelingPage.Table.Columns");
	// const tFilters = useTranslations("FuelingPage.Table.Filters");
	const { setEditingFueling, editingFueling } = useFuelingFormContext();
	const queryClient = useQueryClient();

	const [isModalEditOpen, setIsModalEditOpen] = useState(false);

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
		(fueling: FuelingData) => {
			setEditingFueling(fueling);
			setIsModalEditOpen(true);
		},
		[setEditingFueling, setIsModalEditOpen],
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
		() => getFuelingColumns(actions, tColumns),
		[actions, tColumns],
	);

	// Sample fueling data
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

	const handleUpdate = () =>
		queryClient.invalidateQueries({
			queryKey: ["fueling-get"],
		});

		const cardFuelingData = useMemo(
		() => [
			{
				title: "Total de abastecimentos",
				value: <AnimatedCounter value={23} />,
				Icon: FuelIcon,
				description: "Total de abastecimentos registrados",
			},
			{
				title: "Abastecimentos no mês",
				value: <AnimatedCounter value={13} />,
				Icon: FuelIcon,
				description: "Total de veículos cadastrados neste mês",
			},
			{
				title: "Total gasto no mês",
				value: <AnimatedCounter value={12650} />,
				Icon: DollarSignIcon,
				description: "Total gasto com abastecimento no mês",
			},
			{
				title: "Combustível mais escolhido",
				value: "Diesel",
				Icon: CarFrontIcon,
				description: "Combustível com mais abastecimentos",
			},
		],
		[],
	);

	return (
		<div className="flex flex-1 flex-col gap-6">
			<CarouselCardInsight cardData={cardFuelingData} />
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
						{/* <DataTableFacetedFilter
							options={brandColumnOptions}
							column={brandColumn}
							title={tFilters("brand")}
						/> */}
					</div>
					<div className="flex items-center gap-2">
						<Button
							onClick={() => {
								setEditingFueling(undefined);
								setIsModalEditOpen(true);
							}}
						>
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
				<ModalTableFueling open={isModalEditOpen} setOpen={setIsModalEditOpen}>
					<FormFuelingData editingFueling={editingFueling} />
				</ModalTableFueling>
				<ModalDeleteFueling
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
