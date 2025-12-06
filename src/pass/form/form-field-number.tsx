import type { ComponentProps } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import NumberInputStepper from "../../components/ui/number-input-stepper";

interface FormFieldNumberProps<T extends FieldValues>
	extends ComponentProps<typeof NumberInputStepper> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	onValueChange?: (value: number) => void;
}

export function FormFieldNumber<T extends FieldValues>({
	control,
	name,
	label,
	onValueChange,
	...props
}: FormFieldNumberProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full">
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
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
