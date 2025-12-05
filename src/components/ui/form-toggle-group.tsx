"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type ToggleOption = {
	value: string;
	label: string;
	icon?: React.ReactNode;
};

type SingleToggleProps = {
	type?: "single";
	value?: string;
	onChange: (value: string) => void;
};

type MultipleToggleProps = {
	type: "multiple";
	value?: string[];
	onChange: (value: string[]) => void;
};

export type FormToggleGroupProps = (SingleToggleProps | MultipleToggleProps) &
	Omit<
		React.ComponentPropsWithoutRef<typeof ToggleGroup>,
		"value" | "onValueChange" | "type" | "onChange"
	> & {
		options: ToggleOption[];
		itemClassName?: string;
	};

export const FormToggleGroup = React.forwardRef<
	React.ElementRef<typeof ToggleGroup>,
	FormToggleGroupProps
>(({ options, className, itemClassName, ...props }, ref) => {
	const handleValueChange = (val: string & string[]) => {
		if (props.onChange) {
			props.onChange(val);
		}
	};

	return (
		<ToggleGroup
			ref={ref}
			className={cn("flex flex-wrap gap-1 justify-start", className)}
			onValueChange={handleValueChange}
			{...(props as any)}
		>
			{options.map((option) => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					aria-label={option.label}
					className={cn(
						"h-8 w-8 p-0  data-[spacing=0]:rounded-md border border-input bg-transparent",
						"hover:bg-accent hover:text-accent-foreground",
						"data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary",
						"text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
						itemClassName,
					)}
				>
					{option.icon && <span className="mr-2">{option.icon}</span>}
					{option.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
});

FormToggleGroup.displayName = "FormButtonGroup";
