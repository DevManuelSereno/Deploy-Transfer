import type { Column } from "@tanstack/react-table";
import type { CSSProperties } from "react";

export const getPinningStyles = <TData, TValue>(
	column: Column<TData, TValue>,
): CSSProperties => {
	const isPinned = column.getIsPinned();
	return {
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		position: !isPinned ? "relative" : "sticky",
		width: column.getSize(),
		zIndex: isPinned ? 1 : 0,
	};
};
