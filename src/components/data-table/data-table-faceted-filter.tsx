"use client";

import type { Column } from "@tanstack/react-table";
import { Check, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	className?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
	className,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const t = useTranslations("DataTable.DataTableFacetedFilter");
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={cn("h-9 border-dashed", className)}
				>
					<Filter />
					{title}
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-1 h-4" />
							<Badge variant="outline" className="rounded-sm lg:hidden">
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge variant="outline" className="rounded-sm px-1">
										{t("selectedCount", { count: selectedValues.size })}
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												variant="outline"
												key={option.value}
												className="rounded-sm px-1"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-56 p-0" align="start">
				<Command>
					<CommandInput
						placeholder={t("filterPlaceholder", {
							title: title?.toLocaleLowerCase() ?? "",
						})}
					/>
					<CommandList>
						<CommandEmpty>{t("noResults")}</CommandEmpty>
						<CommandGroup className="p-1">
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											const newSelectedValues = new Set(selectedValues);
											if (isSelected) {
												newSelectedValues.delete(option.value);
											} else {
												newSelectedValues.add(option.value);
											}
											const filterValues = Array.from(newSelectedValues);
											column?.setFilterValue(
												filterValues.length ? filterValues : undefined,
											);
										}}
										className="rounded-sm"
									>
										<div
											className={cn(
												"flex size-4 items-center justify-center rounded-[4px] border border-input",
												isSelected
													? "bg-primary border-primary text-primary-foreground"
													: "[&_svg]:invisible",
											)}
										>
											<Check className="size-3.5" />
										</div>
										{option.icon && (
											<option.icon className="size-4 text-muted-foreground" />
										)}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="text-muted-foreground ml-auto flex size-4 items-center justify-center text-xs">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>

						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup className="p-1">
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center rounded-sm"
									>
										{t("clearFilters")}
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
