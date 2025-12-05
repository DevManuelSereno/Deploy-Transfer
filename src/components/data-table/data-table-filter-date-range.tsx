"use client";

import type { Column } from "@tanstack/react-table";
import {
	endOfMonth,
	endOfYear,
	format,
	isEqual,
	startOfDay,
	startOfMonth,
	startOfYear,
	subDays,
	subMonths,
	subYears,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DataTableFilterDateRangeProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	className?: string;
	defaultOpen?: boolean;
}

export function DataTableFilterDateRange<TData, TValue>({
	column,
	title = "Período",
	className,
	defaultOpen = false,
}: DataTableFilterDateRangeProps<TData, TValue>) {
	const today = new Date();

	const presets = [
		{ label: "Hoje", range: { from: today, to: today } },
		{
			label: "Ontem",
			range: { from: subDays(today, 1), to: subDays(today, 1) },
		},
		{ label: "Últimos 7 dias", range: { from: subDays(today, 6), to: today } },
		{
			label: "Últimos 30 dias",
			range: { from: subDays(today, 29), to: today },
		},
		{
			label: "Do mês até a data",
			range: { from: startOfMonth(today), to: today },
		},
		{
			label: "Último mês",
			range: {
				from: startOfMonth(subMonths(today, 1)),
				to: endOfMonth(subMonths(today, 1)),
			},
		},
		{
			label: "Do ano até a data",
			range: { from: startOfYear(today), to: today },
		},
		{
			label: "Último ano",
			range: {
				from: startOfYear(subYears(today, 1)),
				to: endOfYear(subYears(today, 1)),
			},
		},
	];

	const [month, setMonth] = useState(today);

	const [date, setDate] = useState<DateRange | undefined>(() => {
		const filterValue = column?.getFilterValue() as DateRange | undefined;
		return filterValue || undefined;
	});

	const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: "off"
	useEffect(() => {
		const filterValue = column?.getFilterValue() as DateRange | undefined;
		if (!filterValue) {
			setDate(undefined);
			setSelectedPreset(null);
			setMonth(today);
		}
	}, [column?.getFilterValue()]);

	const handleReset = () => {
		setDate(undefined);
		setSelectedPreset(null);
		column?.setFilterValue(undefined);
	};

	const handleSelect = (selected: DateRange | undefined) => {
		const newDate = {
			from: selected?.from || undefined,
			to: selected?.to || undefined,
		};
		setDate(newDate);
		setSelectedPreset(null);

		// Only set filter if both from and to are defined
		if (newDate.from && newDate.to) {
			column?.setFilterValue(newDate);
		} else if (!newDate.from && !newDate.to) {
			column?.setFilterValue(undefined);
		}
	};

	const handlePresetSelect = (preset: { label: string; range: DateRange }) => {
		setDate(preset.range);
		setMonth(preset.range.from || today);
		setSelectedPreset(preset.label);

		// Set the filter value on the column
		if (preset.range.from && preset.range.to) {
			column?.setFilterValue(preset.range);
		}
	};

	// Update `selectedPreset` whenever `date` changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: "off"
	useEffect(() => {
		const matchedPreset = presets.find(
			(preset) =>
				isEqual(
					startOfDay(preset.range.from),
					startOfDay(date?.from || new Date(0)),
				) &&
				isEqual(
					startOfDay(preset.range.to),
					startOfDay(date?.to || new Date(0)),
				),
		);
		setSelectedPreset(matchedPreset?.label || null);
	}, [date]);

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
					{date?.from && date.to && (
						<Badge
							variant="outline"
							className="ml-auto 
            hover:bg-secondary text-muted-foreground rounded-full px-1.5 -my-0.5 py-1 cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								handleReset();
							}}
						>
							<X />
						</Badge>
					)}
				</AccordionTrigger>
				<AccordionContent className="pb-2 pt-1">
					<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								id="date"
								variant="outline"
								className={cn(
									"w-full justify-start truncate text-left font-normal dark:bg-background hover:bg-muted/50",
									!date && "text-muted-foreground",
								)}
							>
								<CalendarIcon />
								{date?.from ? (
									date.to ? (
										<>
											{format(date.from, "dd/MM/yyyy")} -{" "}
											{format(date.to, "dd/MM/yyyy")}
										</>
									) : (
										format(date.from, "dd/MM/yyyy")
									)
								) : (
									<span>Selecione um intervalo de datas</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<div className="flex max-sm:flex-col">
								<div className="relative border-border max-sm:order-1 max-sm:border-t sm:w-auto">
									<div className="h-full border-border sm:border-e py-2">
										<div className="flex flex-col px-2 gap-[2px]">
											{presets.map((preset, index) => (
												<Button
													// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
													key={index}
													type="button"
													variant="ghost"
													size="sm"
													className={cn(
														"px-2 w-full justify-start",
														selectedPreset === preset.label && "bg-accent",
													)}
													onClick={() => handlePresetSelect(preset)}
												>
													{preset.label}
												</Button>
											))}
										</div>
									</div>
								</div>
								<Calendar
									autoFocus
									mode="range"
									month={month}
									onMonthChange={setMonth}
									showOutsideDays={false}
									selected={date}
									onSelect={handleSelect}
									locale={ptBR}
									numberOfMonths={2}
								/>
							</div>
						</PopoverContent>
					</Popover>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
