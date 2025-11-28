"use client";

import type { Column } from "@tanstack/react-table";
import { CheckIcon, FilterIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
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
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column.getFacetedUniqueValues();
	const selectedValues = useMemo(
		() => new Set(column.getFilterValue() as string[]),
		[column],
	);

	const options = Array.from(facets.entries())
		.map(([value, count]) => ({
			value: String(value),
			count,
		}))
		.sort((a, b) => b.count - a.count);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-9 border-dashed">
					<FilterIcon className="mr-2 size-4" />
					{title}
					{selectedValues.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							{Array.from(selectedValues).map((selectedValue) => (
								<Badge
									key={selectedValue}
									variant="outline"
									className="rounded-sm px-1 font-normal"
								>
									{selectedValue}
								</Badge>
							))}
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[220px] p-0" align="start">
				<Command>
					{/* Input de busca dentro do Popover */}
					<CommandInput placeholder={`Filtrar ${title.toLowerCase()}...`} />
					<CommandList>
						<CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value);
											} else {
												selectedValues.add(option.value);
											}
											const filterValues = Array.from(selectedValues);
											column.setFilterValue(
												filterValues.length ? filterValues : undefined,
											);
										}}
									>
										<div
											className={cn(
												"mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<CheckIcon className={cn("size-4")} />
										</div>
										<span>{option.value}</span>
										{/* Contagem de cada item */}
										<span className="ml-auto flex size-4 items-center justify-center font-mono text-xs text-muted-foreground">
											{option.count}
										</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{/* Opção de Limpar Filtro */}
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column.setFilterValue(undefined)}
										className="justify-center text-center"
									>
										Limpar filtros
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
