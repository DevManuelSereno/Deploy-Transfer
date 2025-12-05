"use client";

import type { Column } from "@tanstack/react-table";
import {
	ArrowLeftToLineIcon,
	ArrowRightToLineIcon,
	EllipsisIcon,
	PinOffIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTablePinControlsProps<TData, TValue> {
	column: Column<TData, TValue>;
	title?: string;
}

export function DataTablePinControls<TData, TValue>({
	column,
	title,
}: DataTablePinControlsProps<TData, TValue>) {
	if (!column.getCanPin()) return null;

	if (column.getIsPinned()) {
		return (
			<Button
				size="icon"
				variant="ghost"
				className="size-7 shadow-none"
				onClick={() => column.pin(false)}
				aria-label={`Desafixar coluna ${title}`}
				title={`Desafixar coluna ${title}`}
			>
				<PinOffIcon className="opacity-60" size={16} aria-hidden="true" />
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="-mr-1 size-7 shadow-none"
					aria-label={`Opções de fixação para a coluna ${title}`}
					title={`Opções de fixação para a coluna ${title}`}
				>
					<EllipsisIcon className="opacity-60" size={16} aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="rounded-lg p-1">
				<DropdownMenuItem
					className="h-fit rounded-md"
					onClick={() => column.pin("left")}
				>
					<ArrowLeftToLineIcon
						size={16}
						className="opacity-60"
						aria-hidden="true"
					/>
					Fixar à esquerda
				</DropdownMenuItem>
				<DropdownMenuItem
					className="h-fit rounded-md"
					onClick={() => column.pin("right")}
				>
					<ArrowRightToLineIcon
						size={16}
						className="opacity-60"
						aria-hidden="true"
					/>
					Fixar à direita
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
