import { Time } from "@internationalized/date";
import type { ComponentProps } from "react";
import type { TimeValue } from "react-aria-components";
import type { Control, FieldValues, Path } from "react-hook-form";
import { DateInput, TimeField } from "../ui/date-field";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	
} from "../ui/form";

export function stringToTime(timeStr: string | null | undefined): Time | null {
	if (!timeStr) return null;
	const [hours, minutes] = timeStr.split(":").map(Number);
	return new Time(hours, minutes);
}

function timeToString(time: TimeValue | null): string {
	if (!time) return "";
	return `${time.hour.toString().padStart(2, "0")}:${time.minute
		.toString()
		.padStart(2, "0")}`;
}

interface FormFieldTimeProps<T extends FieldValues>
	extends ComponentProps<typeof TimeField> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	className?: string;
}

export function FormFieldTime<T extends FieldValues>({
	control,
	name,
	label,
	className,
	...props
}: FormFieldTimeProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field: { value, onChange, ...rest } }) => (
				<FormItem className="w-full">
					<TimeField
						value={stringToTime(value)}
						onChange={(newTime: TimeValue | null) =>
							onChange(timeToString(newTime))
						}
						className="*:not-first:mt-2"
						{...rest}
						{...props}
					>
						{label && <FormLabel>{label}</FormLabel>}
						<FormControl>
							<DateInput className={className} />
						</FormControl>
					</TimeField>
				</FormItem>
			)}
		/>
	);
}
