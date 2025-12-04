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
	type DocumentationColumnActions,
	getDocumentationColumns,
} from "@/app/[locale]/vehicle/components/columns/columns-table-documentation";
import { ModalDeleteDocumentation } from "@/app/[locale]/vehicle/components/modal/modal-delete-documentation";
import { ModalFormDocumentation } from "@/app/[locale]/vehicle/components/modal/modal-form-documentation";
import { useDocumentationFormContext } from "@/app/[locale]/vehicle/context/documentation-context";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import type { DocumentationData } from "@/app/[locale]/vehicle/types/types-documentation";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/functions.api";
import { DataTableProvider } from "@/providers/data-table-provider";

export function FormDocumentation() {
	const { setEditingDocumentation } = useDocumentationFormContext();
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

	const handleForward = () => setTabPanel("tab-gas-supply");

	const handleBack = () => setTabPanel("tab-general-data");

	const vehicleId = editingVehicle?.id;

	const { data: dataDocumentation, isLoading } = useQuery({
		queryKey: ["documentation-get", vehicleId],
		queryFn: ({ signal }) =>
			getData<DocumentationData[]>({
				url: "/documentation",
				signal,
				query: `where.vehicleId=${vehicleId}&&include.file=true`,
			}),
		enabled: !!vehicleId,
	});

	const openEditModal = useCallback(
		(documentation: DocumentationData) => {
			setEditingDocumentation(documentation);
			setIsModalFormOpen(true);
		},
		[setEditingDocumentation],
	);

	const handleOpenDeleteModal = useCallback(
		(documentation?: DocumentationData) => {
			setEditingDocumentation(documentation);
			setIsModalDeleteOpen(true);
		},
		[setEditingDocumentation],
	);

	const actions: DocumentationColumnActions = useMemo(
		() => ({
			onEdit: openEditModal,
			onDelete: handleOpenDeleteModal,
		}),
		[openEditModal, handleOpenDeleteModal],
	);

	const columns = useMemo(() => getDocumentationColumns(actions), [actions]);

	const tableData = useMemo(
		() => (isLoading ? Array(10).fill({}) : (dataDocumentation ?? [])),
		[isLoading, dataDocumentation],
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

	const table = useReactTable<DocumentationData>({
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
						setEditingDocumentation(undefined);
						setIsModalFormOpen(true);
					}}
				>
					Adicionar documentação
				</Button>

				<ModalFormDocumentation
					open={isModalFormOpen}
					setOpen={setIsModalFormOpen}
				/>

				<ModalDeleteDocumentation
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</div>
			<div className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
				<Button variant="outline" onClick={handleBack}>
					Voltar
				</Button>
				<Button
					type="button"
					onClick={handleForward}
					disabled={!editingVehicle?.id}
				>
					Continuar
				</Button>
			</div>
		</>
	);
}
