"use client";

import { X } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import {
	Toaster as Sonner,
	toast as sonnerToast,
	type ToasterProps,
} from "sonner";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { Button } from "./button";

type ToastVariant = "default" | "success" | "error";

interface ToastProps {
	id: string | number;
	title: string;
	description?: string;
	variant?: ToastVariant;
	icon?: ReactNode;
	button?: {
		label?: string;
		icon?: React.ReactNode;
		onClick?: () => void;
	};
}

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

function createToast(
	variant: ToastVariant,
	data: Omit<ToastProps, "id" | "variant">,
) {
	return sonnerToast.custom(
		(id) => (
			<Toast
				{...data}
				id={id}
				variant={variant}
				icon={
					variant === "success" ? (
						<Icons.circleCheck className="size-5 text-emerald-500" />
					) : variant === "error" ? (
						<Icons.exclamationCircle className="size-5 text-destructive/70 dark:text-destructive" />
					) : null
				}
			/>
		),
		// { duration: Infinity },
	);
}

export const toast = Object.assign(
	(data: Omit<ToastProps, "id">) => createToast("default", data),
	{
		success: (data: Omit<ToastProps, "id">) => createToast("success", data),
		error: (data: Omit<ToastProps, "id">) => createToast("error", data),
	},
);

function Toast({
	id,
	title,
	description,
	button,
	variant = "default",
	icon,
}: ToastProps) {
	const variantClasses = {
		default: "border-l-primary",
		success: "border-l-emerald-500",
		error: "border-l-destructive/70 dark:border-l-destructive",
	}[variant];

	return (
		<div
			className={`flex bg-background rounded-lg border border-l-4 shadow-sm w-full sm:max-w-xs items-center p-3 ${variantClasses}`}
		>
			{icon && <div className="mr-3">{icon}</div>}
			<div className="flex flex-1 items-center">
				<div className="w-full">
					<p className="text-sm font-semibold">{title}</p>
					{description && (
						<p className="mt-0.5 text-xs opacity-60">{description}</p>
					)}
				</div>
			</div>
			<Button
				type="button"
				size={button?.label ? "sm" : "icon"}
				variant="outline"
				onClick={() => {
					button?.onClick?.();
					sonnerToast.dismiss(id);
				}}
				className={cn(
					"group rounded-full bg-transparent! ml-4 [&_svg]:size-3!",
					button?.label ? "px-2.5 h-7" : "size-5",
				)}
			>
				{!button && <X className="opacity-60 group-hover:opacity-100" />}
				{button?.icon ? button?.icon : button?.label}
			</Button>
		</div>
	);
}

export { Toaster };
