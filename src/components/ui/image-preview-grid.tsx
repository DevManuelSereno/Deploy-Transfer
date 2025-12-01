"use client";

import { X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { ImageValue } from "@/app/vehicle/types/types-vehicle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImagePreviewGridProps {
	images: ImageValue[];
	onRemove?: (id: string) => void;
	className?: string;
}

export function ImagePreviewGrid({
	images,
	onRemove,
	className,
}: ImagePreviewGridProps) {
	if (!images || images.length === 0) {
		return null;
	}

	return (
		<div className={cn("grid grid-cols-3 gap-2 md:grid-cols-4", className)}>
			{images.map((image) => (
				<ImagePreviewItem key={image.id} image={image} onRemove={onRemove} />
			))}
		</div>
	);
}

interface ImagePreviewItemProps {
	image: ImageValue;
	onRemove?: (id: string) => void;
}

function ImagePreviewItem({ image, onRemove }: ImagePreviewItemProps) {
	const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

	React.useEffect(() => {
		let active = true; // Flag para evitar atualização de estado se o componente desmontar
		let generatedUrl: string | null = null;

		const loadImage = async () => {
			if (image.file) {
				generatedUrl = URL.createObjectURL(image.file);
				if (active) setObjectUrl(generatedUrl);
				return;
			}
			if (image.url) {
				try {
					const isNgrok = image.url.includes("ngrok");

					if (isNgrok) {
						const response = await fetch(image.url, {
							headers: {
								"ngrok-skip-browser-warning": "1",
							},
						});

						if (!response.ok) throw new Error("Falha ao carregar imagem");

						const blob = await response.blob();
						generatedUrl = URL.createObjectURL(blob);

						if (active) setObjectUrl(generatedUrl);
					} else {
						// Se não for ngrok, usa a URL direta
						if (active) setObjectUrl(image.url);
					}
				} catch (error) {
					console.error("Erro ao carregar imagem via ngrok:", error);
					// Fallback: tenta mostrar a URL original mesmo que falhe (pode mostrar o aviso do ngrok)
					if (active) setObjectUrl(image.url);
				}
			}
		};

		loadImage();

		return () => {
			active = false;
			if (generatedUrl) {
				URL.revokeObjectURL(generatedUrl);
			}
		};
	}, [image.file, image.url]);

	if (!objectUrl) return null;

	return (
		<div className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
			<img
				src={objectUrl}
				alt={image.name ?? "Preview da imagem"}
				className="h-full w-full object-cover"
			/>

			{onRemove && (
				<div className="absolute inset-x-0 top-0 flex justify-end p-1">
					<Button
						type="button"
						size="icon"
						variant="destructive"
						className="size-6 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
						onClick={() => onRemove(image.id)}
					>
						<X className="h-3 w-3" />
						<span className="sr-only">Remover imagem</span>
					</Button>
				</div>
			)}
		</div>
	);
}
