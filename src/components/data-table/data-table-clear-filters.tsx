"use client";

import type { Table } from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableClearFiltersProps<TData>
	extends ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	table: Table<TData>;
}

export function DataTableClearFilters<TData>({
	table,
	variant = "outline",
	size = "sm",
	className,
}: DataTableClearFiltersProps<TData>) {
	const columnFilters = table.getState().columnFilters;
	const activeFiltersCount = columnFilters.length;

	if (activeFiltersCount === 0) {
		return null;
	}

	return (
		<Button
			size={size}
			variant={variant}
			onClick={() => table.resetColumnFilters()}
			className={cn("h-9", className)}
		>
			<X className="size-4" />
			Limpar filtros
			<Badge variant="outline" className="rounded-sm px-1.5">
				{activeFiltersCount}
			</Badge>
		</Button>
	);
}
