"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, Pencil, Trash } from "lucide-react";
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";
import { Button } from "@/components/ui/button";
import type { GasStationType, GasType } from "@/types/models";

export interface FuelingColumnActions {
	onEdit: (document: FuelingData) => void;
	onDelete: (document: FuelingData) => void;
}
export const getFuelingColumns = (
	actions: FuelingColumnActions,
	t: (key: string) => string,
): ColumnDef<FuelingData>[] => [
	{
		accessorKey: "supplyAt",
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
						{t("supplyDate")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		size: 170,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "gasStation",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("supplier")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => (cell.getValue() as GasStationType)?.name,
		enableColumnFilter: true,
		size: 90,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "gas",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("fuel")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => (cell.getValue() as GasType)?.type,
		enableColumnFilter: true,
		size: 130,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "quantity",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("liters")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) =>
			`${Number(cell.getValue()).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}L`,
		enableColumnFilter: true,
		size: 90,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "totalPrice",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("value")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) =>
			Number(cell.getValue()).toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
				maximumFractionDigits: 2,
			}),
		enableColumnFilter: true,
		size: 160,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		id: "actions",
		size: 96,
		enablePinning: true,
		meta: {
			headerClassName: "data-pinned:-ml-[96px]",
			cellClassName: "data-pinned:-ml-[96px]",
		},
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
