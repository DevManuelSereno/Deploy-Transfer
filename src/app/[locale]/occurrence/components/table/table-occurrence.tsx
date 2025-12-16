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
import { BusIcon, CarFrontIcon, LucidePlus, TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { getOccurrenceColumns } from "@/app/[locale]/occurrence/components/columns/columns-table-occurrence";
import { FormOccurrenceData } from "@/app/[locale]/occurrence/components/form/form-occurrence-data";
import { ModalDeleteOccurrence } from "@/app/[locale]/occurrence/components/modal/modal-delete-occurrence";
import { ModalTableOccurrence } from "@/app/[locale]/occurrence/components/modal/modal-table-occurrence";
import { useOccurrenceFormContext } from "@/app/[locale]/occurrence/context/occurrence-context";
import type { OccurrenceData } from "@/app/[locale]/occurrence/types/types-occurrence";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSearchInput } from "@/components/data-table/data-table-search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OpenAiToolbar } from "@/components/ui/open-ai-toolbar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DataTableProvider } from "@/providers/data-table-provider";
import type { OccurrenceColumnActions } from "../columns/columns-table-occurrence";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CarouselCardInsight } from "@/components/ui/carousel-card-insight";

export default function TableOccurrence() {
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("OccurrencePage.Table.Columns");
	const { setEditingOccurrence, editingOccurrence } =
		useOccurrenceFormContext();
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
		(occurrence: OccurrenceData) => {
			setEditingOccurrence(occurrence);
			setIsModalEditOpen(true);
		},
		[setEditingOccurrence, setIsModalEditOpen],
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

	const handleUpdate = () =>
		queryClient.invalidateQueries({
			queryKey: ["occurrence-get"],
		});

		const cardOccurrenceData = useMemo(
		() => [
			{
				title: "Total de ocorrências",
				value: <AnimatedCounter value={23} />,
				Icon: TriangleAlertIcon,
				description: "Total de ocorrências registradas",
			},
			{
				title: "Ocorrências no mês",
				value: <AnimatedCounter value={17} />,
				Icon: TriangleAlertIcon,
				description: "Total de ocorrências registradas neste mês",
			},
			{
				title: "Ocorrências em aberto",
				value: <AnimatedCounter value={12} />,
				Icon: TriangleAlertIcon,
				description: "Total de ocorrências em aberto",
			},
			{
				title: "Principal motivo de abertura",
				value: "Acidente",
				Icon: TriangleAlertIcon,
				description: "Principal motivo de abertura de ocorrências",
			},
			{
				title: "Principal grau de gravidade",
				value: "Média",
				Icon: TriangleAlertIcon,
				description: "Principal grau de gravidade das ocorrências",
			},
		],
		[],
	);

	return (
		<div className="flex flex-1 flex-col gap-6">
			<CarouselCardInsight cardData={cardOccurrenceData} />
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
						<Button
							onClick={() => {
								setEditingOccurrence(undefined);
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
				<ModalTableOccurrence
					open={isModalEditOpen}
					setOpen={setIsModalEditOpen}
				>
					<FormOccurrenceData editingOccurrence={editingOccurrence} />
				</ModalTableOccurrence>
				<ModalDeleteOccurrence
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
