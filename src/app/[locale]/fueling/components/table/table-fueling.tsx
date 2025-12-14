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
import { getFuelingColumns } from "@/app/[locale]/fueling/components/columns/columns-table-fueling";
import { FormFuelingData } from "@/app/[locale]/fueling/components/form/form-fueling-data";
import { ModalDeleteFueling } from "@/app/[locale]/fueling/components/modal/modal-delete-fueling";
import { ModalTableFueling } from "@/app/[locale]/fueling/components/modal/modal-table-fueling";
import { useFuelingFormContext } from "@/app/[locale]/fueling/context/fueling-context";
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";
import { DataTable } from "@/components/data-table";
import { DataTableExport } from "@/components/data-table/data-table-export";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
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
import type { FuelingColumnActions } from "../columns/columns-table-fueling";

export default function TableFueling() {
	const tFilters = useTranslations("FuelingPage.Table.Filters");
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("FuelingPage.Table.Columns");
	const { setEditingFueling } = useFuelingFormContext();
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
			VehicleId: 1,
			VehiclePlate: "ABC1D23",
			Date: "2024-12-01T10:30:00Z",
			Liters: 45.5,
			PricePerLiter: 5.89,
			TotalCost: 267.99,
			Odometer: 52340,
			FuelType: "Gasolina",
			Station: "Posto Ipiranga Centro",
			Location: "São Paulo - SP",
			Driver: "João Silva",
			Notes: "Tanque cheio",
			CreatedAt: "2024-12-01T10:35:00Z",
			UpdatedAt: "2024-12-01T10:35:00Z",
		},
		{
			IDF: 2,
			VehicleId: 2,
			VehiclePlate: "XYZ9F88",
			Date: "2024-12-02T08:15:00Z",
			Liters: 80.0,
			PricePerLiter: 6.12,
			TotalCost: 489.6,
			Odometer: 125400,
			FuelType: "Diesel",
			Station: "Shell Rodovia",
			Location: "Rio de Janeiro - RJ",
			Driver: "Maria Santos",
			Notes: "Abastecimento em viagem",
			CreatedAt: "2024-12-02T08:20:00Z",
			UpdatedAt: "2024-12-02T08:20:00Z",
		},
		{
			IDF: 3,
			VehicleId: 3,
			VehiclePlate: "JKL3E55",
			Date: "2024-12-03T14:45:00Z",
			Liters: 38.2,
			PricePerLiter: 4.79,
			TotalCost: 183.02,
			Odometer: 67890,
			FuelType: "Etanol",
			Station: "Petrobras Avenida",
			Location: "Belo Horizonte - MG",
			Driver: "Carlos Oliveira",
			Notes: "",
			CreatedAt: "2024-12-03T14:50:00Z",
			UpdatedAt: "2024-12-03T14:50:00Z",
		},
		{
			IDF: 4,
			VehicleId: 4,
			VehiclePlate: "MNO7B12",
			Date: "2024-12-04T11:20:00Z",
			Liters: 65.0,
			PricePerLiter: 6.05,
			TotalCost: 393.25,
			Odometer: 89450,
			FuelType: "Diesel",
			Station: "BR Mania",
			Location: "Curitiba - PR",
			Driver: "Ana Costa",
			Notes: "Nota fiscal anexada",
			CreatedAt: "2024-12-04T11:25:00Z",
			UpdatedAt: "2024-12-04T11:25:00Z",
		},
		{
			IDF: 5,
			VehicleId: 5,
			VehiclePlate: "QRS5Y77",
			Date: "2024-12-05T09:10:00Z",
			Liters: 42.8,
			PricePerLiter: 5.95,
			TotalCost: 254.66,
			Odometer: 34560,
			FuelType: "Gasolina",
			Station: "Posto Ipiranga Sul",
			Location: "Florianópolis - SC",
			Driver: "Pedro Alves",
			Notes: "Pagamento via cartão corporativo",
			CreatedAt: "2024-12-05T09:15:00Z",
			UpdatedAt: "2024-12-05T09:15:00Z",
		},
		{
			IDF: 6,
			VehicleId: 6,
			VehiclePlate: "TUV2H99",
			Date: "2024-12-06T16:30:00Z",
			Liters: 48.0,
			PricePerLiter: 5.87,
			TotalCost: 281.76,
			Odometer: 45230,
			FuelType: "Gasolina",
			Station: "Shell Express",
			Location: "Goiânia - GO",
			Driver: "Juliana Martins",
			Notes: "",
			CreatedAt: "2024-12-06T16:35:00Z",
			UpdatedAt: "2024-12-06T16:35:00Z",
		},
		{
			IDF: 7,
			VehicleId: 7,
			VehiclePlate: "DEF6K44",
			Date: "2024-12-07T07:50:00Z",
			Liters: 35.5,
			PricePerLiter: 4.85,
			TotalCost: 172.18,
			Odometer: 78920,
			FuelType: "Etanol",
			Station: "Posto Ale",
			Location: "Porto Alegre - RS",
			Driver: "Roberto Lima",
			Notes: "Abastecimento parcial",
			CreatedAt: "2024-12-07T07:55:00Z",
			UpdatedAt: "2024-12-07T07:55:00Z",
		},
		{
			IDF: 8,
			VehicleId: 8,
			VehiclePlate: "GHI1L22",
			Date: "2024-12-08T13:40:00Z",
			Liters: 95.0,
			PricePerLiter: 6.18,
			TotalCost: 587.1,
			Odometer: 156780,
			FuelType: "Diesel",
			Station: "BR Petrobras",
			Location: "Salvador - BA",
			Driver: "Fernanda Souza",
			Notes: "Veículo com alta quilometragem",
			CreatedAt: "2024-12-08T13:45:00Z",
			UpdatedAt: "2024-12-08T13:45:00Z",
		},
		{
			IDF: 9,
			VehicleId: 9,
			VehiclePlate: "PQR8T66",
			Date: "2024-12-09T10:00:00Z",
			Liters: 40.0,
			PricePerLiter: 5.92,
			TotalCost: 236.8,
			Odometer: 12340,
			FuelType: "Elétrico",
			Station: "Estação Tesla",
			Location: "São Paulo - SP",
			Driver: "Lucas Ferreira",
			Notes: "Carregamento completo",
			CreatedAt: "2024-12-09T10:05:00Z",
			UpdatedAt: "2024-12-09T10:05:00Z",
		},
		{
			IDF: 10,
			VehicleId: 10,
			VehiclePlate: "STU3P11",
			Date: "2024-12-10T15:25:00Z",
			Liters: 52.3,
			PricePerLiter: 5.98,
			TotalCost: 312.75,
			Odometer: 56780,
			FuelType: "Gasolina",
			Station: "Posto Petrobras Centro",
			Location: "Fortaleza - CE",
			Driver: "Beatriz Rocha",
			Notes: "Faturamento mensal",
			CreatedAt: "2024-12-10T15:30:00Z",
			UpdatedAt: "2024-12-10T15:30:00Z",
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
						<DataTableUpdate handleUpdate={handleUpdate} />
						<DataTableExport />
						<Separator
							orientation="vertical"
							className="data-[orientation=vertical]:w-px data-[orientation=vertical]:h-4 mx-0.5"
						/>
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
					<FormFuelingData />
				</ModalTableFueling>
				<ModalDeleteFueling
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
