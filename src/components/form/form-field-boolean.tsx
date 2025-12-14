"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface FormFieldBooleanProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	trueLabel?: string;
	falseLabel?: string;
	disabled?: boolean;
	className?: string;
}

export function FormFieldBoolean<T extends FieldValues>({
	control,
	name,
	label,
	trueLabel = "Sim",
	falseLabel = "Não",
	disabled,
	className,
}: FormFieldBooleanProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn(className)}>
					{label && <FormLabel className="truncate">{label}</FormLabel>}
					<FormControl>
						<div className="bg-muted dark:bg-input/50 inline-flex h-9 w-full rounded-lg p-[3px]">
							<RadioGroup
								onValueChange={(val) => field.onChange(val === "true")}
								value={
									field.value === undefined ? "false" : String(field.value)
								}
								className="group
                  after:bg-background dark:after:border dark:after:border-input dark:after:bg-input/30 
                  has-focus-visible:after:border-ring w-full has-focus-visible:after:ring-ring/50 
                  relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium 
                  after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:shadow-sm 
                  after:transition-[translate,box-shadow] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] 
                  has-focus-visible:after:ring-[3px]
                  data-[state=true]:after:translate-x-0 
                  data-[state=false]:after:translate-x-full disabled:cursor-not-allowed disabled:opacity-50"
								data-state={String(Boolean(field.value))}
								disabled={disabled}
							>
								<label
									className="group-data-[state=false]:text-muted-foreground/70
                  relative z-10 inline-flex h-full px-2 py-1 cursor-pointer items-center 
                  justify-center whitespace-nowrap transition-colors select-none"
								>
									{trueLabel}
									<FormControl>
										<RadioGroupItem value="true" className="sr-only" />
									</FormControl>
								</label>
								<label
									className="group-data-[state=true]:text-muted-foreground/70
                  relative z-10 inline-flex h-full px-2 py-1 cursor-pointer items-center 
                  justify-center whitespace-nowrap transition-colors select-none"
								>
									{falseLabel}
									<FormControl>
										<RadioGroupItem value="false" className="sr-only" />
									</FormControl>
								</label>
							</RadioGroup>
						</div>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
