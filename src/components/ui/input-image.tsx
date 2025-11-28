"use client";

import { Upload } from "lucide-react";
import * as React from "react";
import type { ImageValue } from "@/app/transfer/types/types-vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputImageProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"type" | "value" | "onChange"
	> {
	value?: ImageValue[];
	onChange?: (images: ImageValue[]) => void;
	maxFiles?: number;
}

export const InputImage = React.forwardRef<HTMLInputElement, InputImageProps>(
	(
		{
			className,
			value,
			onChange,
			maxFiles,
			disabled,
			accept = "image/*",
			multiple = true,
			name,
			id,
			...props
		},
		ref,
	) => {
		const [isDragging, setIsDragging] = React.useState(false);
		const inputRef = React.useRef<HTMLInputElement | null>(null);

		// Expor o ref do RHF pra esse input interno
		React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

		const images = value ?? [];

		const handleFiles = React.useCallback(
			(filesList: FileList | File[] | null) => {
				if (!filesList || !onChange) return;

				const current = images ?? [];
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

				const nextImages: ImageValue[] = [
					...current,
					...slicedFiles.map((file) => ({
						id:
							typeof crypto !== "undefined" && "randomUUID" in crypto
								? crypto.randomUUID()
								: `${file.name}-${file.lastModified}-${Math.random()
										.toString(36)
										.slice(2)}`,
						file,
						name: file.name,
					})),
				];

				onChange(nextImages);

				// limpa o input pra permitir selecionar o mesmo arquivo de novo
				if (inputRef.current) {
					inputRef.current.value = "";
				}
			},
			[images, maxFiles, onChange],
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
				? `${images.length}/${maxFiles} imagens`
				: `${images.length} imagens`;

		return (
			<div className={cn("flex flex-col gap-2", className)}>
				{/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
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
					{/* Input "real" escondido, mas acessível pro RHF */}
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
					<p className="mb-1 text-sm">Arraste e solte imagens aqui, ou</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => inputRef.current?.click()}
						disabled={disabled}
					>
						Selecionar imagens
					</Button>
					<p className="mt-2 text-xs text-muted-foreground">
						{remainingText} • Formatos: JPG, PNG, WEBP
					</p>
				</div>
			</div>
		);
	},
);

InputImage.displayName = "InputImage";
