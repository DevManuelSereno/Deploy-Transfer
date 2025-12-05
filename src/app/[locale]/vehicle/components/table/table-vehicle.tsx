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
import { ModalDeleteVehicle } from "@/app/[locale]/vehicle/components/modal/modal-delete-vehicle";
import { ModalTableVehicle } from "@/app/[locale]/vehicle/components/modal/modal-table-vehicle";
import TabsVehicle from "@/app/[locale]/vehicle/components/tabs/tabs-vehicle";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import type { VehicleData } from "@/app/[locale]/vehicle/types/types-vehicle";
import { DataTable } from "@/components/data-table";
import { DataTableExport } from "@/components/data-table/data-table-export";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
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
import {
	getVehicleColumns,
	type VehicleColumnActions,
} from "../columns/columns-table-vehicle";

export default function TableVehicle() {
	const tFilters = useTranslations("VehiclePage.Table.Filters");
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("VehiclePage.Table.Columns");
	const tStatus = useTranslations("VehiclePage.Table.Status");
	const { setEditingVehicle } = useVehicleFormContext();
	const { isModalEditOpen, setIsModalEditOpen, setTabPanel } =
		useModalContext();
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
		(vehicle: VehicleData) => {
			setEditingVehicle(vehicle);
			setTabPanel("tab-general-data");
			setIsModalEditOpen(true);
		},
		[setEditingVehicle, setTabPanel, setIsModalEditOpen],
	);

	const handleOpenDeleteModal = useCallback(
		(vehicle?: VehicleData) => {
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
		() => getVehicleColumns(actions, tColumns as any, tStatus as any),
		[actions, tColumns, tStatus],
	);

	const { data: dataVehicle, isLoading } = useQuery({
		queryKey: ["vehicle-get"],
		queryFn: ({ signal }) =>
			getData<VehicleData[]>({
				url: "/vehicle",
				signal,
				query:
					"include.classification=true&include.category=true" +
					"&&include.brand=true&&include.company&&include.status=true",
			}),
		select: (vehicleData) =>
			vehicleData.map((vehicle) => ({
				...vehicle,
				status: vehicle.status.name,
				company: vehicle.company.name,
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

	const table = useReactTable<VehicleData>({
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

	const statusColumn = table.getColumn("status");

	const statusColumnOptions = useMemo(() => {
		const uniqueStatus = [...new Set(dataVehicle?.map((v) => v.status))];

		return uniqueStatus.map((status) => ({
			label: status,
			value: status,
		}));
	}, [dataVehicle]);

	const companyColumn = table.getColumn("company");

	const companyColumnOptions = useMemo(() => {
		const uniqueCompanies = [...new Set(dataVehicle?.map((v) => v.company))];

		return uniqueCompanies.map((company) => ({
			label: company,
			value: company,
		}));
	}, [dataVehicle]);

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
						<DataTableFacetedFilter
							options={statusColumnOptions}
							column={statusColumn}
							title={tFilters("status")}
						/>
						<DataTableFacetedFilter
							options={companyColumnOptions}
							column={companyColumn}
							title={tFilters("company")}
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
				<ModalTableVehicle open={isModalEditOpen} setOpen={setIsModalEditOpen}>
					<TabsVehicle />
				</ModalTableVehicle>
				<ModalDeleteVehicle
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
