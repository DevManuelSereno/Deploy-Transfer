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
import { useCallback, useMemo, useState } from "react";
import {
	getOccurrenceColumns,
	type OccurrenceColumnActions,
} from "@/app/[locale]/vehicle/components/columns/columns-table-occurrence";
import { ModalDeleteOccurrence } from "@/app/[locale]/vehicle/components/modal/modal-delete-occurrence";
import { ModalFormOccurrence } from "@/app/[locale]/vehicle/components/modal/modal-form-occurrence";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useOccurrenceFormContext } from "@/app/[locale]/vehicle/context/occurrence-context";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import type { DocumentationData } from "@/app/[locale]/vehicle/types/types-documentation";
import type { OccurrenceData } from "@/app/[locale]/vehicle/types/types-occurrence";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/functions.api";
import { DataTableProvider } from "@/providers/data-table-provider";

export function FormOccurrence() {
	const { setEditingOccurrence } = useOccurrenceFormContext();
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

	const handleBack = () => setTabPanel("tab-gas-supply");

	const vehicleId = editingVehicle?.id;

	const { data: dataOccurrence, isLoading } = useQuery({
		queryKey: ["occurrence-get", vehicleId],
		queryFn: ({ signal }) =>
			getData<OccurrenceData[]>({
				url: "/occurrence",
				signal,
				query:
					`where.vehicleId=${vehicleId}&&include.file=true&&` +
					"include.classification&&include.seriousness=true",
			}),
		enabled: !!vehicleId,
	});

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

	const columns = useMemo(() => getOccurrenceColumns(actions), [actions]);
	const tableData = useMemo(
		() => (isLoading ? Array(10).fill({}) : (dataOccurrence ?? [])),
		[isLoading, dataOccurrence],
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

	const table = useReactTable<OccurrenceData>({
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
		<>
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
					Adicionar ocorrência
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
			<div className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
				<Button variant="outline" onClick={handleBack}>
					Voltar
				</Button>
			</div>
		</>
	);
}
