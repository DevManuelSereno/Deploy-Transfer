import type { Control, FieldValues, Path } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import MultipleSelector, {
  type MultipleSelectorProps,
} from "@/components/ui/multiselect"
import { cn } from "@/lib/utils"

interface FormFieldMultiSelectProps<T extends FieldValues>
  extends MultipleSelectorProps {
  control: Control<T>
  name: Path<T>
  label: string
  className?: string
}

export function FormFieldMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  className,
  ...props
}: FormFieldMultiSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultipleSelector
              {...field}
              inputProps={{
                placeholder: "Buscar...",
              }}
              emptyIndicator={
                <p className="text-center text-sm">
                  Nenhum resultado encontrado
                </p>
              }
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
