"use client";

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
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
	Control,
	FieldValues,
	Path,
	PathValue,
	UseFormReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormFieldDateRangeProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	control: Control<T>;
	name: Path<T>;
	label?: string;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export const formatDate = (date: string | Date | undefined) =>
	date ? format(new Date(date), "dd/MM/yyyy") : "";

export function FormFieldDateRange<T extends FieldValues>({
	form,
	control,
	name,
	label,
	placeholder = "Selecione o período",
	className,
	disabled,
}: FormFieldDateRangeProps<T>) {
	const today = new Date();
	const [month, setMonth] = useState(today);
	const formValue = form.watch(name);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const hasError = control?.getFieldState(name).error;

	const toDate = useCallback((value: unknown): Date | null => {
		if (!value) return null;

		const date = new Date(value as string);
		return Number.isNaN(date.getTime()) ? null : date;
	}, []);

	const presets = useMemo(() => {
		const today = new Date();

		return [
			{ label: "Hoje", range: { from: today, to: today } },
			{
				label: "Ontem",
				range: { from: subDays(today, 1), to: subDays(today, 1) },
			},
			{
				label: "Últimos 7 dias",
				range: { from: subDays(today, 6), to: today },
			},
			{
				label: "Últimos 30 dias",
				range: { from: subDays(today, 29), to: today },
			},
			{
				label: "Do mês até a data",
				range: { from: startOfMonth(today), to: today },
			},
			{
				label: "Mês passado",
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
				label: "Ano passado",
				range: {
					from: startOfYear(subYears(today, 1)),
					to: endOfYear(subYears(today, 1)),
				},
			},
		];
	}, []);

	const selectedPreset = useMemo(() => {
		const from = toDate(formValue?.from);
		const to = toDate(formValue?.to);

		if (!from || !to) return null;

		return (
			presets.find(
				(preset) =>
					isEqual(startOfDay(preset.range.from), startOfDay(from)) &&
					isEqual(startOfDay(preset.range.to), startOfDay(to)),
			)?.label ?? null
		);
	}, [formValue?.from, formValue?.to, presets, toDate]);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("w-full", className)}>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
							<PopoverTrigger asChild>
								<div className="relative">
									<Button
										type="button"
										variant="outline"
										className={cn(
											"h-10 group justify-start font-normal w-full transition-none dark:bg-background dark:hover:bg-background",
											hasError && "border-destructive dark:border-destructive",
											className,
										)}
										disabled={disabled}
									>
										<CalendarIcon
											size={16}
											className="text-muted-foreground/80 transition-colors group-hover:text-foreground"
											aria-hidden="true"
										/>
										<span
											className={cn(
												"truncate",
												!formValue?.from && "text-muted-foreground",
											)}
										>
											{formValue?.from ? (
												formValue?.to ? (
													<>
														{formatDate(formValue.from)} –{" "}
														{formatDate(formValue.to)}
													</>
												) : (
													formatDate(formValue.from)
												)
											) : (
												placeholder
											)}
										</span>
									</Button>
									{field.value?.from && (
										<Button
											size="icon"
											variant="ghost"
											className="size-6 rounded-[calc(var(--radius)-5px)] absolute top-1/2 end-2 -translate-y-1/2"
											onClick={(e) => {
												e.preventDefault();
												form.setValue(
													name,
													{ from: "", to: "" } as PathValue<T, Path<T>>,
													{ shouldValidate: true, shouldDirty: true },
												);
											}}
										>
											<X />
										</Button>
									)}
								</div>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="end">
								<div className="flex max-sm:flex-col">
									<div className="relative border-border max-sm:order-1 max-sm:border-t sm:w-fit">
										<div className="h-full border-border sm:border-e py-2">
											<div className="flex flex-col px-2 gap-[2px]">
												{presets.map((preset, index) => (
													<Button
														key={index}
														size="sm"
														type="button"
														variant="ghost"
														className={cn(
															"h-10 w-full justify-start",
															selectedPreset === preset.label && "bg-accent",
														)}
														onClick={() => {
															const { from, to } = preset.range;
															form.setValue(
																name,
																{
																	from: from.toISOString(),
																	to: to.toISOString(),
																} as PathValue<T, Path<T>>,
																{ shouldValidate: true, shouldDirty: true },
															);
															setMonth(from || today);
														}}
													>
														{preset.label}
													</Button>
												))}
											</div>
										</div>
									</div>
									<Calendar
										mode="range"
										month={month}
										onMonthChange={setMonth}
										selected={
											formValue?.from && formValue?.to
												? {
														from: new Date(formValue.from),
														to: new Date(formValue.to),
													}
												: undefined
										}
										onSelect={(range) =>
											form.setValue(
												name,
												{
													from: range?.from?.toISOString() || "",
													to: range?.to?.toISOString() || "",
												} as PathValue<T, Path<T>>,
												{ shouldValidate: true, shouldDirty: true },
											)
										}
										locale={ptBR}
										numberOfMonths={2}
										autoFocus
									/>
								</div>
							</PopoverContent>
						</Popover>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
