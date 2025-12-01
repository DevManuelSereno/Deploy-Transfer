"use client";

import { Upload } from "lucide-react";
import * as React from "react";
import type { FileValue } from "@/app/[locale]/vehicle/types/types-documentation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputFileProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"type" | "value" | "onChange"
	> {
	value?: any;
	onChange?: (files: any) => void;
	maxFiles?: number;
	accept?: string;
	multiple?: boolean;
}

export const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
	(
		{
			className,
			value,
			onChange,
			maxFiles,
			disabled,
			accept = "*/*",
			multiple = true,
			name,
			id,
			...props
		},
		ref,
	) => {
		const [isDragging, setIsDragging] = React.useState(false);
		const inputRef = React.useRef<HTMLInputElement | null>(null);

		React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

		const files = value ?? [];

		const handleFiles = React.useCallback(
			(filesList: FileList | File[] | null) => {
				if (!filesList || !onChange) return;

				const current = files ?? [];
				const filesArray = Array.from(filesList);

				const remainingSlots =
					typeof maxFiles === "number"
						? Math.max(maxFiles - current.length, 0)
						: filesArray.length;

				const slicedFiles =
					typeof maxFiles === "number"
						? filesArray.slice(0, remainingSlots)
						: filesArray;

				if (slicedFiles.length === 0) return;

				const nextFiles: any = [
					...current,
					...slicedFiles.map((file) => ({
						id:
							typeof crypto !== "undefined" && "randomUUID" in crypto
								? crypto.randomUUID()
								: `${file.name}-${file.lastModified}-${Math.random()
										.toString(36)
										.slice(2)}`,
						file,
						fileName: file.name,
						size: file.size,
						mimeType: file.type,
						path: file.name,
						createdAt: new Date(),
					})),
				];

				onChange(nextFiles);

				if (inputRef.current) {
					inputRef.current.value = "";
				}
			},
			[files, maxFiles, onChange],
		);

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			handleFiles(e.target.files);
		};

		const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (disabled) return;
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		};

		const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (disabled) return;
			setIsDragging(true);
		};

		const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
		};

		const remainingText =
			typeof maxFiles === "number"
				? `${files.length}/${maxFiles} arquivos`
				: `${files.length} arquivos`;

		function getAllowedExtensions(accept: string) {
			const mimeToExtensions = {
				"image/*": ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"],
				"application/pdf": ["pdf"],
				"application/msword": ["doc"],
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
					["docx"],
				"text/plain": ["txt"],
			};

			return accept
				.split(",")
				.map((item) => item.trim())
				.flatMap(
					(mime) =>
						mimeToExtensions[mime as keyof typeof mimeToExtensions] || [],
				)
				.map((ext) => `.${ext}`);
		}

		return (
			<div className={cn("flex flex-col gap-2", className)}>
				{/** biome-ignore lint/a11y/useSemanticElements: wrapper para drag/drop */}
				<div
					role="region"
					className={cn(
						"border-input bg-background/50 hover:bg-accent/40 flex flex-col items-center justify-center rounded-md border border-dashed px-4 py-6 text-center text-sm shadow-xs transition-colors",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						disabled && "pointer-events-none opacity-60",
						isDragging && "border-ring bg-accent/60",
					)}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					<Input
						ref={inputRef}
						id={id ?? name}
						name={name}
						type="file"
						className="hidden"
						multiple={multiple}
						accept={accept}
						disabled={disabled}
						onChange={handleInputChange}
						{...props}
					/>

					<Upload className="mb-2 h-5 w-5 opacity-70" />
					<p className="mb-1 text-sm">Arraste e solte arquivos aqui, ou</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => inputRef.current?.click()}
						disabled={disabled}
					>
						Selecionar arquivos
					</Button>
					<p className="mt-2 text-xs text-muted-foreground">{remainingText}</p>
					<p className="mt-2 text-xs text-muted-foreground">
						Tipos permitidos: {getAllowedExtensions(accept).join(", ")}
					</p>
				</div>
			</div>
		);
	},
);

InputFile.displayName = "InputFile";
