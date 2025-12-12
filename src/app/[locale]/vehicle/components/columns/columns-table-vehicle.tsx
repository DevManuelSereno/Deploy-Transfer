"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ChevronsUpDown, Pencil, Trash } from "lucide-react";
import type { useTranslations } from "next-intl";
import type { VehicleData } from "@/app/[locale]/vehicle/types/types-vehicle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface VehicleColumnActions {
	onEdit: (vehicle: VehicleData) => void;
	onDelete: (vehicle: VehicleData) => void;
}

type TFunction = ReturnType<typeof useTranslations>;

export const getVehicleColumns = (
	actions: VehicleColumnActions,
	t: TFunction,
): ColumnDef<VehicleData>[] => [
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
		accessorKey: "IDV",
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
		size: 65,
	},
	{
		accessorKey: "Model",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("model")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		size: 160,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	// {
	// 	accessorKey: "BrandId",
	// 	header: ({ column }) => {
	// 		return (
	// 			<div className="flex items-center h-full">
	// 				<Button
	// 					variant="ghost"
	// 					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
	// 					className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
	// 				>
	// 					{t("brand")}
	// 					<ChevronsUpDown className="size-3" />
	// 				</Button>
	// 			</div>
	// 		);
	// 	},
	// 	enableColumnFilter: true,
	// 	size: 160,
	// 	meta: {
	// 		cellClassName: "grow",
	// 		headerClassName: "grow",
	// 	},
	// },
	{
		accessorKey: "Seats",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("seats")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		size: 80,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "Plate",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						{t("plate")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	// {
	// 	accessorKey: "CompanyId",
	// 	header: ({ column }) => {
	// 		return (
	// 			<div className="flex items-center h-full">
	// 				<Button
	// 					variant="ghost"
	// 					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
	// 					className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
	// 				>
	// 					{t("company")}
	// 					<ChevronsUpDown className="size-3" />
	// 				</Button>
	// 			</div>
	// 		);
	// 	},
	// 	enableColumnFilter: true,
	// 	filterFn: (row, columnId, filterValue: unknown) => {
	// 		if (!filterValue) return true;
	// 		const values = Array.isArray(filterValue)
	// 			? filterValue
	// 			: [String(filterValue)];
	// 		const rowValue = String(row.getValue(columnId) ?? "");
	// 		return values.includes(rowValue);
	// 	},
	// 	size: 230,
	// 	meta: {
	// 		cellClassName: "grow",
	// 		headerClassName: "grow",
	// 	},
	// },
	{
		accessorKey: "CreatedAt",
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
						{t("createdAt")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		size: 160,
		meta: {
			cellClassName: "grow",
			headerClassName: "grow",
		},
	},
	{
		accessorKey: "UpdatedAt",
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
						{t("updatedAt")}
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
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
			const vehicle = row.original;

			return (
				<div className="md:opacity-0 md:group-hover/table:opacity-100 transition-opacity backdrop-blur-xs p-0 h-[calc(100%-2px)]">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								actions.onEdit(vehicle);
							}}
						>
							<Pencil />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => actions.onDelete(vehicle)}
						>
							<Trash className="text-destructive" />
						</Button>
					</div>
				</div>
			);
		},
	},
];
