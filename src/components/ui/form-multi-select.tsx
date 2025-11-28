"use client";

import * as React from "react";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select"; // ajuste o path se necessário
import { cn } from "@/lib/utils";

type SelectOption = {
	value: string;
	label: string;
};

export interface FormMultiSelectProps
	extends Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"onChange" | "value"
	> {
	options: SelectOption[];
	values?: string[]; // controlled values
	defaultValues?: string[]; // uncontrolled default
	onValuesChange?: (values: string[]) => void;
	placeholder?: string;
	groupLabel?: string;
	search?: boolean | { placeholder?: string; emptyMessage?: string };
	disabled?: boolean;
	className?: string;
}

/**
 * FormMultiSelect
 *
 * - values: forma controlada (string[])
 * - defaultValues: forma não-controlada
 * - onValuesChange: (values: string[]) => void
 */
export const FormMultiSelect = React.forwardRef<
	HTMLButtonElement,
	FormMultiSelectProps
>(
	(
		{
			options,
			values,
			defaultValues,
			onValuesChange,
			placeholder,
			groupLabel,
			search = true,
			disabled,
			className,
			onBlur,
			...props
		},
		ref,
	) => {
		return (
			<MultiSelect
				values={values}
				defaultValues={defaultValues}
				onValuesChange={onValuesChange}
			>
				<MultiSelectTrigger
					// ref={ref}
					onBlur={onBlur}
					disabled={disabled}
					className={cn("w-full", className)}
					{...props}
				>
					<MultiSelectValue placeholder={placeholder} />
				</MultiSelectTrigger>

				<MultiSelectContent search={search}>
					{groupLabel ? (
						<div className="px-2 py-1.5 text-xs text-muted-foreground">
							{groupLabel}
						</div>
					) : null}

					{/* Items */}
					{options.map((option) => (
						<MultiSelectItem
							key={option.value}
							value={option.value}
							badgeLabel={option.label}
						>
							{option.label}
						</MultiSelectItem>
					))}
				</MultiSelectContent>
			</MultiSelect>
		);
	},
);

FormMultiSelect.displayName = "FormMultiSelect";
