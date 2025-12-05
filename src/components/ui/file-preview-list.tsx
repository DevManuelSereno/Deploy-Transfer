"use client";

import { Trash } from "lucide-react";
import * as React from "react";
import type { FileValue } from "@/app/[locale]/vehicle/types/types-documentation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilePreviewListProps {
	files?: FileValue[];
	onRemove?: (id: number) => void;
	className?: string;
}

export function FilePreviewList({
	files,
	onRemove,
	className,
}: FilePreviewListProps) {
	if (!files || files.length === 0) return null;
	return (
		<ul className={cn("flex flex-col gap-2", className)}>
			{files.map((f) => (
				<li
					key={f.id}
					className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
				>
					<div className="min-w-0">
						<div className="truncate text-sm font-medium">
							{f.fileName ?? "-"}
						</div>
						<div className="mt-0.5 text-xs text-muted-foreground">
							{f.mimeType ?? "—"} • {formatBytes(f.size ?? 0)}
						</div>
					</div>

					{onRemove && (
						<Button
							type="button"
							size="icon"
							variant="ghost"
							onClick={() => onRemove(f.id)}
							aria-label={`Remover ${f.fileName ?? "-"}`}
						>
							<Trash className="h-4 w-4" />
						</Button>
					)}
				</li>
			))}
		</ul>
	);
}

// helper formato bytes
function formatBytes(bytes: number) {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const value = parseFloat((bytes / k ** i).toFixed(2));
	return `${value} ${sizes[i]}`;
}
