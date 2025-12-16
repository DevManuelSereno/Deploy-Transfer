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
import { ModalDeleteOccurrence } from "@/app/[locale]/occurrence/components/modal/modal-delete-occurrence";
import { useOccurrenceFormContext } from "@/app/[locale]/occurrence/context/occurrence-context";
import type { OccurrenceData } from "@/app/[locale]/occurrence/types/types-occurrence";
import {
	getOccurrenceColumns,
	type OccurrenceColumnActions,
} from "@/app/[locale]/vehicle/components/columns/columns-table-vehicle-occurrence";
import { ModalFormOccurrence } from "@/app/[locale]/vehicle/components/modal/modal-form-vehicle-occurrence";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/functions.api";
import { DataTableProvider } from "@/providers/data-table-provider";

export function FormOccurrence() {
	const t = useTranslations("VehiclePage.Occurrence");
	const tColumns = useTranslations("VehiclePage.Occurrence.columns");
	const { setEditingOccurrence } = useOccurrenceFormContext();
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

	// const { data: dataOccurrence, isLoading } = useQuery({
	// 	queryKey: ["occurrence-get", vehicleId],
	// 	queryFn: ({ signal }) =>
	// 		getData<OccurrenceData[]>({
	// 			url: "/occurrence",
	// 			signal,
	// 			query:
	// 				`where.vehicleId=${vehicleId}&&include.file=true&&` +
	// 				"include.classification&&include.seriousness=true",
	// 		}),
	// 	enabled: !!vehicleId,
	// });

	const openEditModal = useCallback(
		(occurrence: OccurrenceData) => {
			setEditingOccurrence(occurrence);
			setIsModalFormOpen(true);
		},
		[setEditingOccurrence],
	);

	const handleOpenDeleteModal = useCallback(
		(occurrence?: OccurrenceData) => {
			setEditingOccurrence(occurrence);
			setIsModalDeleteOpen(true);
		},
		[setEditingOccurrence],
	);

	const actions: OccurrenceColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(
		() => getOccurrenceColumns(actions, tColumns as any),
		[actions, tColumns],
	);
	// const tableData = useMemo(
	// 	() => (isLoading ? Array(5).fill({}) : (dataOccurrence ?? [])),
	// 	[isLoading, dataOccurrence],
	// );
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

	// Sample occurrence data
	const dataOccurrence = [
		{
			IDO: 1,
			CreatedAt: "2025-01-10T08:30:00Z",
			UpdatedAt: "2025-01-10T09:00:00Z",
			VehicleId: 101,
			Classification: "ACIDENTE",
			Severity: "ALTA",
			OccurrenceAt: "2025-01-10T08:15:00Z",
			CaseNumber: "CASE-0001",
			Description: "Colisão frontal em via urbana",
		},
		{
			IDO: 2,
			CreatedAt: "2025-01-11T10:20:00Z",
			UpdatedAt: "2025-01-11T10:45:00Z",
			VehicleId: 102,
			Classification: "MANUTENCAO",
			Severity: "MEDIA",
			OccurrenceAt: "2025-01-11T09:50:00Z",
			CaseNumber: null,
			Description: "Falha mecânica no motor",
		},
		{
			IDO: 3,
			CreatedAt: "2025-01-12T14:00:00Z",
			UpdatedAt: "2025-01-12T14:10:00Z",
			VehicleId: 103,
			Classification: "ROUBO",
			Severity: "ALTA",
			OccurrenceAt: "2025-01-12T13:40:00Z",
			CaseNumber: "RB-7782",
			Description: null,
		},
		{
			IDO: 4,
			CreatedAt: "2025-01-13T07:15:00Z",
			UpdatedAt: "2025-01-13T07:45:00Z",
			VehicleId: 104,
			Classification: "AVARIA",
			Severity: "BAIXA",
			OccurrenceAt: "2025-01-13T07:00:00Z",
		},
		{
			IDO: 5,
			CreatedAt: "2025-01-14T18:30:00Z",
			UpdatedAt: "2025-01-14T19:00:00Z",
			VehicleId: 105,
			Classification: "ACIDENTE",
			Severity: "MEDIA",
			OccurrenceAt: "2025-01-14T18:10:00Z",
			CaseNumber: "CASE-0055",
			Description: "Batida traseira sem vítimas",
		},
		{
			IDO: 6,
			CreatedAt: "2025-01-15T11:00:00Z",
			UpdatedAt: "2025-01-15T11:05:00Z",
			VehicleId: 106,
			Classification: "INFRAÇÃO",
			Severity: "BAIXA",
			OccurrenceAt: "2025-01-15T10:50:00Z",
			CaseNumber: null,
			Description: "Estacionamento em local proibido",
		},
		{
			IDO: 7,
			CreatedAt: "2025-01-16T16:40:00Z",
			UpdatedAt: "2025-01-16T17:00:00Z",
			VehicleId: 107,
			Classification: "INCIDENTE",
			Severity: "MEDIA",
			OccurrenceAt: "2025-01-16T16:20:00Z",
			Description: "Pneu furado durante trajeto",
		},
		{
			IDO: 8,
			CreatedAt: "2025-01-17T09:10:00Z",
			UpdatedAt: "2025-01-17T09:30:00Z",
			VehicleId: 108,
			Classification: "ROUBO",
			Severity: "ALTA",
			OccurrenceAt: "2025-01-17T08:55:00Z",
			CaseNumber: "RB-9901",
			Description: "Veículo roubado em estacionamento",
		},
		{
			IDO: 9,
			CreatedAt: "2025-01-18T13:25:00Z",
			UpdatedAt: "2025-01-18T13:40:00Z",
			VehicleId: 109,
			Classification: "MANUTENCAO",
			Severity: "BAIXA",
			OccurrenceAt: "2025-01-18T13:00:00Z",
			CaseNumber: "MAN-3321",
			Description: "Troca preventiva de óleo",
		},
		{
			IDO: 10,
			CreatedAt: "2025-01-19T20:00:00Z",
			UpdatedAt: "2025-01-19T20:30:00Z",
			VehicleId: 110,
			Classification: "ACIDENTE",
			Severity: "ALTA",
			OccurrenceAt: "2025-01-19T19:45:00Z",
			CaseNumber: "CASE-0100",
			Description: "Capotamento em rodovia",
		},
	];

	const tableData = useMemo(() => dataOccurrence ?? [], []);

	const table = useReactTable<OccurrenceData>({
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
					setEditingOccurrence(undefined);
					setIsModalFormOpen(true);
				}}
			>
				{t("addButton")}
			</Button>
			<ModalFormOccurrence
				open={isModalFormOpen}
				setOpen={setIsModalFormOpen}
			/>

			<ModalDeleteOccurrence
				open={isModalDeleteOpen}
				setOpen={setIsModalDeleteOpen}
			/>
		</div>
	);
}
