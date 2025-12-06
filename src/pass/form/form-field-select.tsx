import type { ComponentProps } from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface Option {
  value: string
  label: string
}

interface FormFieldSelectProps<T extends FieldValues>
  extends ComponentProps<typeof Select> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
  options: Option[]
  className?: string
  buttonProps?: ComponentProps<"button">
  onValueChange?: (value: string) => void
}

export function FormFieldSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  buttonProps,
  className,
  onValueChange,
  ...props
}: FormFieldSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            name={field.name}
            value={field.value}
            onValueChange={(value) => {
              onValueChange?.(value)
              field.onChange(value)
            }}
            {...props}
          >
            <FormControl>
              <SelectTrigger
                {...buttonProps}
                className={cn(
                  "w-full truncate bg-background",
                  buttonProps?.className,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px]">
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-sm"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
