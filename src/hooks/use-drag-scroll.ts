"use client";

import type React from "react";

import { useCallback, useEffect, useRef } from "react";

interface UseDragScrollOptions {
	orientation?: "horizontal" | "vertical" | "both";
	sensitivity?: number;
	disabled?: boolean;
}

interface UseDragScrollReturn<T extends HTMLElement = HTMLElement> {
	ref: React.RefObject<T | null>;
	isDragging: boolean;
}

export function useDragScroll<T extends HTMLElement = HTMLElement>({
	orientation = "both",
	sensitivity = 1,
	disabled = false,
}: UseDragScrollOptions = {}): UseDragScrollReturn<T> {
	const ref = useRef<T>(null);
	const isDragging = useRef(false);
	const startPos = useRef({ x: 0, y: 0 });
	const scrollStart = useRef({ x: 0, y: 0 });

	const handleMouseDown = useCallback((e: MouseEvent) => {
		if (!ref.current) return;

		isDragging.current = true;
		startPos.current = { x: e.clientX, y: e.clientY };
		scrollStart.current = {
			x: ref.current.scrollLeft,
			y: ref.current.scrollTop,
		};

		if (ref.current) {
			ref.current.style.cursor = "grabbing";
			ref.current.style.userSelect = "none";
		}
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging.current || !ref.current) return;

			const deltaX = e.clientX - startPos.current.x;
			const deltaY = e.clientY - startPos.current.y;

			const adjustedDeltaX = deltaX * sensitivity;
			const adjustedDeltaY = deltaY * sensitivity;

			if (orientation === "horizontal" || orientation === "both") {
				ref.current.scrollLeft = scrollStart.current.x - adjustedDeltaX;
			}

			if (orientation === "vertical" || orientation === "both") {
				ref.current.scrollTop = scrollStart.current.y - adjustedDeltaY;
			}
		},
		[orientation, sensitivity],
	);

	const handleMouseUp = useCallback(() => {
		isDragging.current = false;

		if (ref.current) {
			ref.current.style.cursor = "grab";
			ref.current.style.userSelect = "auto";
		}
	}, []);

	const handleMouseLeave = useCallback(() => {
		isDragging.current = false;

		if (ref.current) {
			ref.current.style.cursor = "grab";
			ref.current.style.userSelect = "auto";
		}
	}, []);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		element.style.cursor = disabled ? "default" : "grab";

		if (disabled) return;

		element.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		element.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			element.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			element.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleMouseLeave,
		disabled,
	]);

	return {
		ref,
		isDragging: isDragging.current,
	};
}
