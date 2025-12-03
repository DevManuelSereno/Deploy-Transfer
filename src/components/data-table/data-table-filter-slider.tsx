"use client"

import type { Column } from "@tanstack/react-table"
import { X } from "lucide-react"
import { useEffect, useId } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSliderInput } from "@/hooks/use-slider-input"
import { cn } from "@/lib/utils"
import NumberInputStepper from "../number-input-stepper"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { Badge } from "../ui/badge"

interface DataTableFilterSliderProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  className?: string
  defaultOpen?: boolean
  formatOptions?: Intl.NumberFormatOptions
}

export default function DataTableFilterSlider<TData, TValue>({
  column,
  title,
  className,
  defaultOpen = false,
  formatOptions,
}: DataTableFilterSliderProps<TData, TValue>) {
  const id = useId()

  const facetedMinMax = column?.getFacetedMinMaxValues()
  const minValue = facetedMinMax?.[0] ?? 0
  const maxValue = facetedMinMax?.[1] ?? 100

  const handleFilterChange = (values: [number, number]) => {
    if (values[0] === minValue && values[1] === maxValue) {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(values)
    }
  }

  const {
    sliderValues,
    inputValues,
    setSliderValues,
    setInputValues,
    handleSliderChange,
    handleInputChange,
  } = useSliderInput({
    minValue,
    maxValue,
    initialValue: [minValue, maxValue],
    onFilterChange: handleFilterChange,
  })

  const filterValue = column?.getFilterValue() as [number, number] | undefined

  useEffect(() => {
    if (filterValue) {
      setSliderValues(filterValue)
      setInputValues(filterValue)
    } else {
      setSliderValues([minValue, maxValue])
      setInputValues([minValue, maxValue])
    }
  }, [filterValue, minValue, maxValue, setSliderValues, setInputValues])

  const handleSliderChangeWithFilter = (values: [number, number]) => {
    handleSliderChange(values)
    if (values[0] === minValue && values[1] === maxValue) {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(values)
    }
  }

  const handleClear = () => {
    column?.setFilterValue(undefined)
    setSliderValues([minValue, maxValue])
    setInputValues([minValue, maxValue])
  }

  const isFiltered =
    sliderValues[0] !== minValue || sliderValues[1] !== maxValue

  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full", className)}
      defaultValue={defaultOpen ? "filter" : undefined}
    >
      <AccordionItem
        value="filter"
        className="rounded-md border bg-background px-3 outline-none last:border-b py-1 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
      >
        <AccordionTrigger className="flex justify-between items-center py-2 hover:no-underline focus-visible:ring-0 gap-3">
          {title}
          {isFiltered && (
            <Badge
              variant="outline"
              className="ml-auto hover:bg-secondary text-muted-foreground rounded-full px-1.5 -my-0.5 py-1 cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                handleClear()
              }}
            >
              <X className="size-3" />
            </Badge>
          )}
        </AccordionTrigger>

        <AccordionContent className="pb-2 pt-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2.5">
                <Label htmlFor={`${id}-min`}>Mín.</Label>
                <NumberInputStepper
                  id={`${id}-min`}
                  value={inputValues[0]}
                  onChange={(value) => handleInputChange(value, 0)}
                  minValue={minValue}
                  maxValue={maxValue}
                  formatOptions={formatOptions}
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor={`${id}-max`}>Máx.</Label>
                <NumberInputStepper
                  id={`${id}-max`}
                  value={inputValues[1]}
                  onChange={(value) => handleInputChange(value, 1)}
                  minValue={minValue}
                  maxValue={maxValue}
                  formatOptions={formatOptions}
                />
              </div>
            </div>

            <Slider
              value={sliderValues}
              onValueChange={handleSliderChangeWithFilter}
              min={minValue}
              max={maxValue}
              step={1}
              className="[&_span]:rounded [&_span]:cursor-pointer"
              aria-label={`${title} Range Slider`}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
