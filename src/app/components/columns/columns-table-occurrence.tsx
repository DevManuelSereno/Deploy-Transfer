"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ChevronsUpDown, Pencil, Trash } from "lucide-react";
import type { OccurrenceData } from "@/app/types/types-occurrence";
import { Button } from "@/components/ui/button";
import type { ClassificationType, SeriousnessType } from "@/types/models";

export interface OccurrenceColumnActions {
	onEdit: (occurrence: OccurrenceData) => void;
	onDelete: (occurrence: OccurrenceData) => void;
}
export const getOccurrenceColumns = (
	actions: OccurrenceColumnActions,
): ColumnDef<OccurrenceData>[] => [
	{
		accessorKey: "occurrenceDate",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Data da ocorrência
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		cell: ({ cell }) => {
			if (!cell.getValue()) return "-";
			if (typeof cell.getValue() === "string")
				return new Date(cell.getValue() as string).toLocaleDateString("pt-BR", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
		},
	},
	{
		accessorKey: "classification",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Classificação
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => (cell.getValue() as ClassificationType).description,
		enableColumnFilter: true,
	},
	{
		accessorKey: "seriousness",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Seriedade
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => (cell.getValue() as SeriousnessType).level,
		enableColumnFilter: true,
	},
	{
		id: "actions",
		size: 96,
		enablePinning: true,
		cell: ({ row }) => {
			const occurrence = row.original;

			return (
				<div className="md:opacity-0 md:group-hover/table:opacity-100 transition-opacity backdrop-blur-xs p-0 h-[calc(100%-2px)]">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								actions.onEdit(occurrence);
							}}
						>
							<Pencil />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => actions.onDelete(occurrence)}
						>
							<Trash className="text-destructive" />
						</Button>
					</div>
				</div>
			);
		},
	},
];
