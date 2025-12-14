import type { ComponentProps } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface FormFieldTextProps<T extends FieldValues>
	extends ComponentProps<typeof Input> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	className?: string;
	inputClassName?: string;
	onValueChange?: (value: string) => void;
}

export function FormFieldText<T extends FieldValues>({
	control,
	name,
	label,
	className,
	inputClassName,
	onValueChange,
	...props
}: FormFieldTextProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Input
							{...props}
							{...field}
							type={props.type || "text"}
							className={cn("dark:bg-background", inputClassName)}
							onBlur={(e) => {
								const value = e.target.value;
								onValueChange?.(value);
								field.onBlur();
							}}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
