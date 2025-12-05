"use client";

import { type Cell, flexRender } from "@tanstack/react-table";
import { TableCell } from "@/components/ui/table";
import { getPinningStyles } from "@/lib/table";
import { cn } from "@/lib/utils";

interface DataTableColumnCellProps<TData, TValue> {
	cell: Cell<TData, TValue>;
}

export function DataTableColumnCell<TData, TValue>({
	cell,
}: DataTableColumnCellProps<TData, TValue>) {
	const { column } = cell;
	const isPinned = column.getIsPinned();

	const isLastLeftPinned =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinned =
		isPinned === "right" && column.getIsFirstColumn("right");

	return (
		<TableCell
			key={cell.id}
			className={cn(
				"truncate px-3 flex items-center [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned][data-last-col]]:border-border",
				column.id === "actions"
					? "data-pinned:p-0 data-pinned:border-0!"
					: "data-pinned:bg-background/90 data-pinned:backdrop-blur-xs dark:data-pinned:bg-[#161616]/90",

				column.columnDef.meta?.cellClassName,
			)}
			style={{ ...getPinningStyles(column) }}
			data-pinned={isPinned || undefined}
			data-last-col={
				isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
			}
		>
			{cell.column.id === "actions" ? (
				<div className="opacity-0 group-hover/table:opacity-100 transition-opacity backdrop-blur-xs py-2 px-3 bg-background dark:bg-[#161616]/90 h-[calc(100%-2px)]">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</div>
			) : (
				flexRender(cell.column.columnDef.cell, cell.getContext())
			)}
		</TableCell>
	);
}
