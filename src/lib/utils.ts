import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const result = reader.result;
			if (typeof result === "string") {
				// result = "data:image/png;base64,AAAA..."
				const parts = result.split(",");
				resolve(parts[1] ?? "");
			} else {
				reject(new Error("Falha ao ler arquivo"));
			}
		};

		reader.onerror = (error) => reject(error);

		reader.readAsDataURL(file);
	});
}

export function dataUrlToBase64(url: string): string {
	if (!url.startsWith("data:")) return url; // se por acaso você já salvar só a base64
	const parts = url.split(",");
	return parts[1] ?? "";
}
