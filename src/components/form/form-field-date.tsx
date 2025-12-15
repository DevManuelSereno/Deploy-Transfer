"use client";

import { addDays, format, isEqual, startOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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

interface FormFieldDateProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	control: Control<T>;
	name: Path<T>;
	label?: string;
	placeholder?: string;
	formItemClassName?: string;
	className?: string;
	disabled?: boolean;
}

export const formatDate = (date: string | Date | undefined) =>
	date ? format(new Date(date), "dd/MM/yyyy") : "";

export function FormFieldDate<T extends FieldValues>({
	form,
	control,
	name,
	label,
	placeholder = "Selecione uma data",
	className,
	formItemClassName,
	disabled,
}: FormFieldDateProps<T>) {
	const today = new Date();
	const [month, setMonth] = useState(today);
	const formValue = form.watch(name);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const hasError = control?.getFieldState(name).error;

	// Presets adaptados para data única
	const presets = useMemo(() => {
		const today = new Date();

		return [
			{ label: "Hoje", date: today },
			{ label: "Ontem", date: subDays(today, 1) },
			{ label: "Amanhã", date: addDays(today, 1) },
			{ label: "Daqui a 7 dias", date: addDays(today, 7) },
		];
	}, []);

	const toDate = useCallback((value: unknown): Date | null => {
		if (!value) return null;

		const date = new Date(value as string);
		return Number.isNaN(date.getTime()) ? null : date;
	}, []);

	const selectedPreset = useMemo(() => {
		const parsedDate = toDate(formValue);
		if (!parsedDate) return null;

		const formDate = startOfDay(parsedDate);

		const matched = presets.find((preset) =>
			isEqual(startOfDay(preset.date), formDate),
		);

		return matched?.label ?? null;
	}, [formValue, presets, toDate]);

	const handleSelect = (date: Date | undefined) => {
		if (date) {
			form.setValue(name, date.toISOString() as PathValue<T, Path<T>>, {
				shouldValidate: true,
				shouldDirty: true,
			});
			setIsPopoverOpen(false); // Fecha o popover ao selecionar
		}
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("w-full", formItemClassName)}>
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
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? formatDate(field.value) : placeholder}
										</span>
									</Button>
									{field.value && (
										<Button
											size="icon"
											variant="ghost"
											className="size-6 rounded-[calc(var(--radius)-5px)] absolute top-1/2 end-2 -translate-y-1/2"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												form.setValue(name, "" as PathValue<T, Path<T>>, {
													shouldValidate: true,
													shouldDirty: true,
												});
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
															handleSelect(preset.date);
															setMonth(preset.date);
														}}
													>
														{preset.label}
													</Button>
												))}
											</div>
										</div>
									</div>
									<Calendar
										mode="single"
										month={month}
										onMonthChange={setMonth}
										selected={field.value ? new Date(field.value) : undefined}
										onSelect={handleSelect}
										locale={ptBR}
										// numberOfMonths={1} // Geralmente 1 mês é suficiente para data única
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
