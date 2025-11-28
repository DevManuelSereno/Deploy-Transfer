"use client";

import * as React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectOption = {
	value: string;
	label: string;
};

export interface FormSelectProps
	extends Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"onChange" | "value"
	> {
	options: SelectOption[];
	value: string;
	onChange: (value: string) => void;
	onBlur: () => void;
	placeholder?: string;
	groupLabel?: string;
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
	(
		{
			options,
			value,
			onChange,
			onBlur,
			placeholder,
			groupLabel,
			className,
			...props
		},
		ref,
	) => {
		return (
			<Select onValueChange={onChange} value={value} disabled={props.disabled}>
				<SelectTrigger
					ref={ref}
					onBlur={onBlur}
					className={cn("w-full", className)}
					{...props}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		);
	},
);

FormSelect.displayName = "FormSelect";
