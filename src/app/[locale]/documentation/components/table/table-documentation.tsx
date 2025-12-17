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
import { FileTextIcon, LucidePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { getDocumentationColumns } from "@/app/[locale]/documentation/components/columns/columns-table-documentation";
import { FormDocumentationData } from "@/app/[locale]/documentation/components/form/form-documentation-data";
import { ModalDeleteDocumentation } from "@/app/[locale]/documentation/components/modal/modal-delete-documentation";
import { ModalTableDocumentation } from "@/app/[locale]/documentation/components/modal/modal-table-documentation";
import { useDocumentationFormContext } from "@/app/[locale]/documentation/context/documentation-context";
import type { DocumentationData } from "@/app/[locale]/documentation/types/types-documentation";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSearchInput } from "@/components/data-table/data-table-search-input";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarouselCardInsight } from "@/components/ui/carousel-card-insight";
import { OpenAiToolbar } from "@/components/ui/open-ai-toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DataTableProvider } from "@/providers/data-table-provider";
import type { DocumentationColumnActions } from "../columns/columns-table-documentation";

export default function TableDocumentation() {
	const tTable = useTranslations("DataTable");
	const tColumns = useTranslations("DocumentationPage.Table.Columns");
	const { setEditingDocumentation, editingDocumentation } = useDocumentationFormContext();
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
		(documentation: DocumentationData) => {
			setEditingDocumentation(documentation);
			setIsModalEditOpen(true);
		},
		[setEditingDocumentation, setIsModalEditOpen],
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

	const columns = useMemo(
		() => getDocumentationColumns(actions, tColumns),
		[actions, tColumns],
	);

	// Sample documentation data
	const dataDocumentation: DocumentationData[] = [
		{
			IDD: 1,
			Type: "CNH",
			ExpiryAt: "2025-12-31",
			VehicleId: 201,
			FileId: 1,
			CreatedAt: "2025-01-10T08:15:00Z",
			UpdatedAt: "2025-01-10T08:15:00Z",
		},
		{
			IDD: 2,
			Type: "CRLV",
			ExpiryAt: "2025-06-15",
			VehicleId: 202,
			FileId: 2,
			CreatedAt: "2025-01-15T09:30:00Z",
			UpdatedAt: "2025-01-15T09:30:00Z",
		},
		{
			IDD: 3,
			Type: "Seguro",
			ExpiryAt: "2025-08-20",
			VehicleId: 203,
			FileId: 3,
			CreatedAt: "2025-01-18T14:12:00Z",
			UpdatedAt: "2025-01-18T14:12:00Z",
		},
		{
			IDD: 4,
			Type: "IPVA",
			ExpiryAt: "2025-03-30",
			VehicleId: 204,
			FileId: 4,
			CreatedAt: "2025-01-22T11:00:00Z",
			UpdatedAt: "2025-01-22T11:10:00Z",
		},
		{
			IDD: 5,
			Type: "Licenciamento",
			ExpiryAt: "2025-11-10",
			VehicleId: 205,
			FileId: 5,
			CreatedAt: "2025-01-25T16:45:00Z",
			UpdatedAt: "2025-01-25T16:45:00Z",
		},
		{
			IDD: 6,
			Type: "CRLV",
			ExpiryAt: "2025-05-20",
			VehicleId: 201,
			FileId: 6,
			CreatedAt: "2025-02-01T08:05:00Z",
			UpdatedAt: "2025-02-01T08:05:00Z",
		},
		{
			IDD: 7,
			Type: "Seguro",
			ExpiryAt: "2025-09-15",
			VehicleId: 206,
			FileId: 7,
			CreatedAt: "2025-02-03T13:20:00Z",
			UpdatedAt: "2025-02-03T13:20:00Z",
		},
		{
			IDD: 8,
			Type: "CNH",
			ExpiryAt: "2026-01-10",
			VehicleId: 202,
			FileId: 8,
			CreatedAt: "2025-02-07T17:10:00Z",
			UpdatedAt: "2025-02-07T17:10:00Z",
		},
		{
			IDD: 9,
			Type: "IPVA",
			ExpiryAt: "2025-04-05",
			VehicleId: 207,
			FileId: 9,
			CreatedAt: "2025-02-10T09:00:00Z",
			UpdatedAt: "2025-02-10T09:00:00Z",
		},
		{
			IDD: 10,
			Type: "Licenciamento",
			ExpiryAt: "2025-10-25",
			VehicleId: 204,
			FileId: 10,
			CreatedAt: "2025-02-12T15:30:00Z",
			UpdatedAt: "2025-02-12T15:30:00Z",
		},
		{
			IDD: 11,
			Type: "CNH",
			ExpiryAt: "2025-11-30",
			VehicleId: 208,
			FileId: 11,
			CreatedAt: "2025-02-15T10:40:00Z",
			UpdatedAt: "2025-02-15T10:40:00Z",
		},
	];

	const tableData = useMemo(() => dataDocumentation ?? [], []);

	const table = useReactTable<DocumentationData>({
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
			queryKey: ["documentation-get"],
		});

	const cardDocumentationData = useMemo(
		() => [
			{
				title: "Total de documentos",
				value: <AnimatedCounter value={15} />,
				Icon: FileTextIcon,
				description: "Total de documentos registrados",
			},
			{
				title: "Documentos vencendo",
				value: <AnimatedCounter value={3} />,
				Icon: FileTextIcon,
				description: "Documentos que vencem em até 30 dias",
			},
			{
				title: "Documentos vencidos",
				value: <AnimatedCounter value={1} />,
				Icon: FileTextIcon,
				description: "Documentos já vencidos",
			},
			{
				title: "Tipo mais comum",
				value: "CNH",
				Icon: FileTextIcon,
				description: "Tipo de documento mais registrado",
			},
		],
		[],
	);

	return (
		<div className="flex flex-1 flex-col gap-6">
			<CarouselCardInsight cardData={cardDocumentationData} />
			<Card
				className={cn(
					"border-0 gap-0 p-0 shadow-custom! bg-[linear-gradient(to_bottom,#ffffff_0%,#fcfcfc_50%,#fafafa_100%)]",
					"dark:bg-[linear-gradient(to_top,#232323_0%,#1c1c1c_30%,#161616_100%)] dark:shadow-none dark:border",
					"dark:border-[#262626] overflow-hidden",
				)}
			>
				<ScrollArea>
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
									setEditingDocumentation(undefined);
									setIsModalEditOpen(true);
								}}
							>
								<LucidePlus />
								{tTable("addButton")}
							</Button>
						</div>
					</div>
				</ScrollArea>
				<DataTableProvider
					recordCount={tableData.length}
					table={table}
					isLoading={false}
				>
					<DataTable />
					<DataTablePagination />
				</DataTableProvider>
				<ModalTableDocumentation open={isModalEditOpen} setOpen={setIsModalEditOpen}>
					<FormDocumentationData editingDocumentation={editingDocumentation} />
				</ModalTableDocumentation>
				<ModalDeleteDocumentation
					open={isModalDeleteOpen}
					setOpen={setIsModalDeleteOpen}
				/>
			</Card>
		</div>
	);
}
