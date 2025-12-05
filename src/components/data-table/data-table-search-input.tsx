"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataTableSearchInputProps extends React.ComponentProps<"input"> {
	value: string;
	onChangeValue: (value: string) => void;
}

export function DataTableSearchInput({
	value,
	onChangeValue,
	className,
	placeholder,
	...props
}: DataTableSearchInputProps) {
	const t = useTranslations("Search");
	const defaultPlaceholder = placeholder ?? t("placeholder");

	return (
		<div className="relative w-fit">
			<Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
			<Input
				placeholder={defaultPlaceholder}
				value={value}
				onChange={(e) => onChangeValue(e.target.value)}
				className={cn("ps-9 w-60", className)}
				{...props}
			/>
			{value.length > 0 && (
				<Button
					size="icon"
					variant="ghost"
					className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6 dark:hover:bg-input/50"
					onClick={() => onChangeValue("")}
					type="button"
				>
					<X className="size-4" />
				</Button>
			)}
		</div>
	);
}
