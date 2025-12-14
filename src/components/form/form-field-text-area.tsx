import type { Control, FieldValues, Path } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

interface FormFieldTextareaProps<T extends FieldValues>
  extends ComponentProps<"textarea"> {
  control: Control<T>
  name: Path<T>
  label?: string
  formItemClassName?: string
}

export function FormFieldTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  className,
  formItemClassName,
  rows = 6,
  maxLength = 150,
  ...props
}: FormFieldTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputGroup className="dark:bg-background overflow-hidden">
              <InputGroupTextarea
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className={cn(
                  "min-h-24 resize-none dark:bg-background",
                  className
                )}
                disabled={disabled}
                {...props}
                {...field}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="tabular-nums">
                  {field.value.length}/{maxLength} caracteres
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
