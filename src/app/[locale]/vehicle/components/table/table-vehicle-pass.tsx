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
import { FormVehiclePassData } from "@/app/[locale]/vehicle/components/form/form-vehicle-pass-data";
import { ModalDeleteVehiclePass } from "@/app/[locale]/vehicle/components/modal/modal-delete-vehicle-pass";
import { ModalTableVehiclePass } from "@/app/[locale]/vehicle/components/modal/modal-table-vehicle-pass";
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

	// const { data: dataVehicle, isLoading } = useQuery({
	// 	queryKey: ["vehicle-get"],
	// 	queryFn: ({ signal }) =>
	// 		getData<VehiclePassData[]>({
	// 			url: "/vehicle",
	// 			signal,
	// 			query:
	// 				"include.classification=true&include.category=true" +
	// 				"&&include.brand=true&&include.company&&include.status=true",
	// 		}),
	// 	select: (vehicleData) =>
	// 		vehicleData.map((vehicle) => ({
	// 			...vehicle,
	// 			// company: vehicle.company.name,
	// 			brand: vehicle.brand.name,
	// 		})),
	// });

	const dataVehicle = [
		{
			IDV: 1,
			Plate: "ABC1D23",
			Model: "Corolla",
			Year: 2020,
			Color: "Prata",
			Seats: 5,
			Chassis: "9BWZZZ377VT004251",
			Fuel: "Gasolina",
			Status: "released",
			Location: "SP",
			Door: 4,
			LuggageCapacity: 3,
			Category: "Sedan",
			RegistrationCode: "12345678901",
			Amenities: "Ar-condicionado",
			InspectionInterval: 10000,
			CompanyId: 12,
			BrandId: 4,
			CreatedAt: "2024-01-10T10:20:00Z",
			UpdatedAt: "2024-09-15T12:40:00Z",
		},
		{
			IDV: 2,
			Plate: "XYZ9F88",
			Model: "Sprinter",
			Year: 2018,
			Color: "Branco",
			Seats: 15,
			Chassis: "8ACZZZ123VT553210",
			Fuel: "Diesel",
			Status: "maintenance",
			Location: "RJ",
			Door: 4,
			LuggageCapacity: 10,
			Category: "Van",
			RegistrationCode: "BR998877665",
			Amenities: "Wi-Fi",
			InspectionInterval: 15000,
			CompanyId: 3,
			BrandId: 7,
			CreatedAt: "2023-05-22T09:10:00Z",
			UpdatedAt: "2024-03-11T14:30:00Z",
		},
		{
			IDV: 3,
			Plate: "JKL3E55",
			Model: "HB20",
			Year: 2021,
			Color: "Preto",
			Seats: 5,
			Chassis: "9BG111377VT003114",
			Fuel: "Etanol",
			Status: "released",
			Location: "MG",
			Door: 4,
			LuggageCapacity: 2,
			Category: "Hatch",
			RegistrationCode: "3344556677",
			Amenities: "Ar-condicionado",
			InspectionInterval: 12000,
			CompanyId: 8,
			BrandId: 10,
			CreatedAt: "2022-08-01T11:00:00Z",
			UpdatedAt: "2024-04-09T17:25:00Z",
		},
		{
			IDV: 4,
			Plate: "MNO7B12",
			Model: "Hilux",
			Year: 2019,
			Color: "Vermelho",
			Seats: 5,
			Chassis: "8AJZZZ377VT112233",
			Fuel: "Diesel",
			Status: "pending",
			Location: "PR",
			Door: 4,
			LuggageCapacity: 4,
			Category: "Pickup",
			RegistrationCode: "1122334455",
			Amenities: "Wi-Fi",
			InspectionInterval: 20000,
			CompanyId: 2,
			BrandId: 4,
			CreatedAt: "2023-11-30T10:15:00Z",
			UpdatedAt: "2024-01-18T15:10:00Z",
		},
		{
			IDV: 5,
			Plate: "QRS5Y77",
			Model: "Civic",
			Year: 2022,
			Color: "Cinza",
			Seats: 5,
			Chassis: "9ABZZZ377VT221144",
			Fuel: "Gasolina",
			Status: "released",
			Location: "SC",
			Door: 4,
			LuggageCapacity: 3,
			Category: "Sedan",
			RegistrationCode: "9988776655",
			Amenities: "Ar-condicionado",
			InspectionInterval: 10000,
			CompanyId: 11,
			BrandId: 6,
			CreatedAt: "2024-02-01T09:30:00Z",
			UpdatedAt: "2024-06-20T18:40:00Z",
		},
		{
			IDV: 6,
			Plate: "TUV2H99",
			Model: "Compass",
			Year: 2023,
			Color: "Branco",
			Seats: 5,
			Chassis: "9DDZZZ377VT999888",
			Fuel: "Gasolina",
			Status: "released",
			Location: "GO",
			Door: 4,
			LuggageCapacity: 3,
			Category: "SUV",
			RegistrationCode: "5544332211",
			Amenities: "Ar-condicionado",
			InspectionInterval: 15000,
			CompanyId: 14,
			BrandId: 12,
			CreatedAt: "2023-07-10T08:00:00Z",
			UpdatedAt: "2024-05-10T16:30:00Z",
		},
		{
			IDV: 7,
			Plate: "DEF6K44",
			Model: "Onix",
			Year: 2020,
			Color: "Azul",
			Seats: 5,
			Chassis: "7HGZZZ377VT002200",
			Fuel: "Etanol",
			Status: "block",
			Location: "RS",
			Door: 4,
			LuggageCapacity: 2,
			Category: "Hatch",
			RegistrationCode: "7788996655",
			Amenities: "Ar-condicionado",
			InspectionInterval: 10000,
			CompanyId: 5,
			BrandId: 9,
			CreatedAt: "2021-10-11T12:40:00Z",
			UpdatedAt: "2024-03-01T13:55:00Z",
		},
		{
			IDV: 8,
			Plate: "GHI1L22",
			Model: "Ducato",
			Year: 2017,
			Color: "Branco",
			Seats: 16,
			Chassis: "6FSZZZ377VT441100",
			Fuel: "Diesel",
			Status: "maintenance",
			Location: "BA",
			Door: 4,
			LuggageCapacity: 12,
			Category: "Micro-ônibus",
			RegistrationCode: "2233445566",
			Amenities: "Wi-Fi",
			InspectionInterval: 20000,
			CompanyId: 6,
			BrandId: 13,
			CreatedAt: "2020-01-02T11:20:00Z",
			UpdatedAt: "2024-07-12T10:10:00Z",
		},
		{
			IDV: 9,
			Plate: "PQR8T66",
			Model: "Model 3",
			Year: 2023,
			Color: "Branco",
			Seats: 5,
			Chassis: "5YJ3E1EA7JF000001",
			Fuel: "Diesel",
			Status: "released",
			Location: "SP",
			Door: 4,
			LuggageCapacity: 2,
			Category: "Sedan",
			RegistrationCode: "TESLA-998877",
			Amenities: "Ar-condicionado",
			InspectionInterval: 30000,
			CompanyId: 22,
			BrandId: 15,
			CreatedAt: "2024-05-01T11:20:00Z",
			UpdatedAt: "2024-08-01T10:00:00Z",
		},
		{
			IDV: 10,
			Plate: "STU3P11",
			Model: "Renegade",
			Year: 2021,
			Color: "Verde",
			Seats: 5,
			Chassis: "9FGZZZ377VT777555",
			Fuel: "Gasolina",
			Status: "released",
			Location: "CE",
			Door: 4,
			LuggageCapacity: 3,
			Category: "SUV",
			RegistrationCode: "8899001122",
			Amenities: "Ar-condicionado",
			InspectionInterval: 12000,
			CompanyId: 9,
			BrandId: 12,
			CreatedAt: "2022-02-15T07:50:00Z",
			UpdatedAt: "2024-06-18T12:00:00Z",
		},
	];

	// const tableData = useMemo(
	// 	() => (isLoading ? Array(30).fill({}) : (dataVehicle ?? [])),
	// 	[isLoading, dataVehicle],
	// );

	const tableData = useMemo(() => dataVehicle ?? [], []);
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

	const table = useReactTable<VehiclePassData>({
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
				</DataTableProvider>
				<ModalTableVehiclePass
					open={isModalEditOpen}
					setOpen={setIsModalEditOpen}
				>
					<FormVehiclePassData />
				</ModalTableVehiclePass>
				<ModalDeleteVehiclePass
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
