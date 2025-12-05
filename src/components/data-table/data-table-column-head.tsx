"use client";

import type { Header } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { TableHead } from "@/components/ui/table";
import { getPinningStyles } from "@/lib/table";
import { cn } from "@/lib/utils";

export function DataTableColumnHead<TData, TValue>({
	header,
	children,
}: {
	header: Header<TData, TValue>;
	children: ReactNode;
}) {
	const { column } = header;
	const isPinned = column.getIsPinned();
	const isLastLeftPinned =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinned =
		isPinned === "right" && column.getIsFirstColumn("right");

	return (
		<TableHead
			key={header.id}
			className={cn(
				"relative flex items-center h-10 truncate px-3 [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned][data-last-col]]:border-border",
				column.id === "actions"
					? "data-pinned:p-0 data-pinned:border-0! data-pinned:pointer-events-none"
					: "data-pinned:bg-background/90 data-pinned:backdrop-blur-xs dark:data-pinned:bg-[#161616]/90",
				header.column.columnDef.meta?.headerClassName,
			)}
			colSpan={header.colSpan}
			style={{ ...getPinningStyles(column) }}
			data-pinned={isPinned || undefined}
			data-last-col={
				isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
			}
		>
			{children}
		</TableHead>
	);
}
