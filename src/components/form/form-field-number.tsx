import type { ComponentProps } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import NumberInputStepper from "../ui/number-input-stepper";

interface FormFieldNumberProps<T extends FieldValues>
	extends ComponentProps<typeof NumberInputStepper> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	onValueChange?: (value: number) => void;
	formItemClassName?: string;
}

export function FormFieldNumber<T extends FieldValues>({
	control,
	name,
	label,
	onValueChange,
	formItemClassName,
	...props
}: FormFieldNumberProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("w-full", formItemClassName)}>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<NumberInputStepper
							value={field.value}
							onChange={field.onChange}
							inputProps={{
								...props.inputProps,
								onBlur: (e) => {
									const parsed = Number(e.target.value);
									if (!Number.isNaN(parsed)) {
										onValueChange?.(parsed);
									}
									props.inputProps?.onBlur?.(e);
								},
							}}
							{...props}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
