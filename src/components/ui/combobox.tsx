"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ComboboxOption = {
	value: string;
	label: string;
};

export interface ComboboxProps
	extends Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"onChange" | "value"
	> {
	options: ComboboxOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
	(
		{
			className,
			options,
			value,
			onChange,
			placeholder = "Selecione...",
			searchPlaceholder = "Procure...",
			emptyText = "Nada encontrado.",
			...props // 3. Capture o restante das props (onBlur, aria-invalid, etc.)
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false);
		const selectedLabel = options.find(
			(option) => option.value === value,
		)?.label;

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn("w-[200px] justify-between", className)}
						ref={ref}
						{...props}
					>
						{value ? selectedLabel : placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
					<Command>
						<CommandInput placeholder={searchPlaceholder} />
						<CommandList>
							<CommandEmpty>{emptyText}</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={(currentValue) => {
											onChange(currentValue === value ? "" : currentValue);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === option.value ? "opacity-100" : "opacity-0",
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	},
);

Combobox.displayName = "Combobox";
