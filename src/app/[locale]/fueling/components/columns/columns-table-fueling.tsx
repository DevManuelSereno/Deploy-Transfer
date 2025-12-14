"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ChevronsUpDown, Pencil, Trash } from "lucide-react";
import type { useTranslations } from "next-intl";
import type { FuelingData } from "@/app/[locale]/fueling/types/types-fueling";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface FuelingColumnActions {
	onEdit: (fueling: FuelingData) => void;
	onDelete: (fueling: FuelingData) => void;
}

type TFunction = ReturnType<typeof useTranslations>;

export const getFuelingColumns = (
	actions: FuelingColumnActions,
	t: TFunction,
): ColumnDef<FuelingData>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="dark:bg-background size-4.5 [&_svg]:size-3"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="dark:bg-background size-4.5 [&_svg]:size-3"
			/>
		),
		enableSorting: false,
		enableHiding: false,
		size: 40,
	},
	{
		accessorKey: "IDF",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("id")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		size: 70,
	},
	{
		accessorKey: "FuelingAt",
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
						{t("date")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		size: 140,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "Odometer",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("odometer")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => {
			const value = cell.getValue() as number;
			return `${value.toFixed(2)} L`;
		},
		enableColumnFilter: true,
		size: 110,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "Total",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("total")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => {
			const value = cell.getValue() as number;
			return new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(value);
		},
		enableColumnFilter: true,
		size: 140,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "Fuel",
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
		enableColumnFilter: true,
		size: 130,
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
			const fueling = row.original;

			return (
				<div className="md:opacity-0 md:group-hover/table:opacity-100 transition-opacity backdrop-blur-xs p-0 h-[calc(100%-2px)]">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								actions.onEdit(fueling);
							}}
						>
							<Pencil />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => actions.onDelete(fueling)}
						>
							<Trash className="text-destructive" />
						</Button>
					</div>
				</div>
			);
		},
	},
];
