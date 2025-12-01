"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ChevronsUpDown, Pencil, Trash } from "lucide-react";
import type { VehicleData } from "@/app/[locale]/vehicle/types/types-vehicle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { BrandType, CompanyType, StatusType } from "@/types/models";

export interface VehicleColumnActions {
	onEdit: (vehicle: VehicleData) => void;
	onDelete: (vehicle: VehicleData) => void;
}
export const getVehicleColumns = (
	actions: VehicleColumnActions,
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
		accessorKey: "identifier",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Identificador
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
		size: 65,
	},
	{
		accessorKey: "createdAt",
		cell: ({ cell }) => {
			if (!cell.getValue()) return "-";
			if (typeof cell.getValue() === "string")
				return new Date(cell.getValue() as string).toLocaleDateString("pt-BR", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
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
						Criado em
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
	},
	{
		accessorKey: "model",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Título
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell, row }) => (
			<div className="flex flex-col">
				<span>{String(cell.getValue())}</span>
				<span className="text-muted-foreground text-sm">
					{row.original.classification?.description}
				</span>
			</div>
		),
		enableColumnFilter: true,
	},
	{
		accessorKey: "brand",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Marca
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => (cell.getValue() as BrandType)?.name,
		enableColumnFilter: true,
	},
	{
		accessorKey: "capacity",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Capacidade
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
	},
	{
		accessorKey: "plate",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Placa
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		enableColumnFilter: true,
	},
	{
		accessorKey: "company",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Companhia
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => (cell.getValue() as CompanyType)?.name,
		enableColumnFilter: true,
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<div className="flex items-center h-full">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground"
					>
						Status
						<ChevronsUpDown className="size-3" />
					</Button>
				</div>
			);
		},
		cell: ({ cell }) => (cell.getValue() as StatusType)?.name,
		enableColumnFilter: true,
	},
	{
		id: "actions",
		size: 96,
		enablePinning: true,
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
