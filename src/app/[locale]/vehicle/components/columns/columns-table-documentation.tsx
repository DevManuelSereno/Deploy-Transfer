"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ChevronsUpDown, Pencil, Trash } from "lucide-react";
import type { DocumentationData } from "@/app/[locale]/vehicle/types/types-documentation";
import { Button } from "@/components/ui/button";
import type { FileType } from "@/types/models/File.schema";

export interface DocumentationColumnActions {
	onEdit: (document: DocumentationData) => void;
	onDelete: (document: DocumentationData) => void;
}
export const getDocumentationColumns = (
	actions: DocumentationColumnActions,
): ColumnDef<DocumentationData>[] => [
	{
		accessorKey: "file",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Documento
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		cell: ({ cell }) =>
			(cell.getValue() as FileType | undefined | null)?.mimeType,
		size: 65,
	},
	{
		accessorKey: "type",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Tipo
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
	},
	{
		accessorKey: "days",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Dias
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) =>
			(cell.getValue() as string[]).length >= 0
				? (cell.getValue() as string[]).join(", ")
				: "-",
	},
	{
		accessorKey: "expiryAt",
		cell: ({ cell }) => {
			if (!cell.getValue()) return "-";
			if (typeof cell.getValue() === "string")
				return new Date(cell.getValue() as string).toLocaleDateString("pt-BR", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
		},
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Vencimento
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
	},
	{
		id: "actions",
		size: 96,
		enablePinning: true,
		cell: ({ row }) => {
			const document = row.original;

			return (
				<div className="md:opacity-0 md:group-hover/table:opacity-100 transition-opacity backdrop-blur-xs p-0 h-[calc(100%-2px)]">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								actions.onEdit(document);
							}}
						>
							<Pencil />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => actions.onDelete(document)}
						>
							<Trash className="text-destructive" />
						</Button>
					</div>
				</div>
			);
		},
	},
];
