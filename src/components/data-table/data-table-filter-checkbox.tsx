"use client";

import type { Column } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import type * as React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DataTableFilterCheckboxProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	className?: string;
	defaultOpen?: boolean;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
}

export function DataTableFilterCheckbox<TData, TValue>({
	column,
	title,
	options,
	defaultOpen = false,
	className,
}: DataTableFilterCheckboxProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	const handleToggle = (value: string) => {
		const newSelected = new Set(selectedValues);
		if (newSelected.has(value)) newSelected.delete(value);
		else newSelected.add(value);

		const filterValues = Array.from(newSelected);
		column?.setFilterValue(filterValues.length ? filterValues : undefined);
	};

	const handleClear = () => {
		column?.setFilterValue(undefined);
	};

	return (
		<Accordion
			type="single"
			collapsible
			className={cn("w-full", className)}
			defaultValue={defaultOpen ? "filter" : undefined}
		>
			<AccordionItem
				value="filter"
				className="rounded-md border bg-background px-3 outline-none last:border-b py-1 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
			>
				<AccordionTrigger className="flex justify-between items-center py-2 hover:no-underline focus-visible:ring-0 gap-3">
					{title}
					{selectedValues.size > 0 && (
						<Badge
							variant="outline"
							className="ml-auto 
            hover:bg-secondary text-muted-foreground rounded-full px-1.5 -my-0.5 py-0.5 cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								handleClear();
							}}
						>
							{selectedValues.size}

							<X />
						</Badge>
					)}
				</AccordionTrigger>

				<AccordionContent className="pb-2">
					<ul className="space-y-0.5">
						{options.map((option) => {
							const isSelected = selectedValues.has(option.value);
							const Icon = option.icon;

							return (
								<li
									key={option.value}
									onClick={() => handleToggle(option.value)}
									className={cn(
										"flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 text-sm transition hover:bg-muted/50",
									)}
								>
									<div
										className={cn(
											"flex size-4 items-center justify-center rounded-[4px] border border-input",
											isSelected
												? "bg-primary border-primary text-primary-foreground"
												: "bg-background",
										)}
									>
										{isSelected && <Check className="size-3.5" />}
									</div>

									{Icon && <Icon className="size-4 text-muted-foreground" />}
									<span className="truncate">{option.label}</span>

									{facets?.get(option.value) && (
										<span className="ml-auto text-xs text-muted-foreground">
											{facets.get(option.value)}
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
