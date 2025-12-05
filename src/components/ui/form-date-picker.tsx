"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FormDatePickerProps
	extends Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"value" | "onChange"
	> {
	value?: Date;
	onChange: (value?: Date) => void;
	onBlur?: () => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export const FormDatePicker = React.forwardRef<
	HTMLButtonElement,
	FormDatePickerProps
>(
	(
		{
			value,
			onChange,
			onBlur,
			placeholder = "Selecione uma data",
			disabled,
			className,
			...props
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false);

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						variant="outline"
						disabled={disabled}
						onBlur={onBlur}
						className={cn(
							"w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground dark:bg-background dark:hover:bg-background",
							className,
						)}
						data-empty={!value}
						{...props}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value ? (
							format(value, "PPP", { locale: ptBR })
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={value}
						onSelect={(date) => {
							onChange(date ?? undefined);
							setOpen(false);
						}}
						disabled={disabled}
					/>
				</PopoverContent>
			</Popover>
		);
	},
);

FormDatePicker.displayName = "FormDatePicker";
