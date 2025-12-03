"use client"

import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import type { HTMLAttributes } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDataTable } from "@/providers/data-table-provider"
import { DataTablePinControls } from "./data-table-pin-controls"

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title?: string
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { isLoading, recordCount } = useDataTable()

  const headerButton = () => {
    return (
      <Button
        variant="ghost"
        className={cn(
          "text-secondary-foreground/80 rounded-sm -ms-3 px-2 h-8 hover:text-foreground",
          className
        )}
        onClick={() => {
          const isSorted = column.getIsSorted()
          if (isSorted === "asc") {
            column.toggleSorting(true)
          } else if (isSorted === "desc") {
            column.clearSorting()
          } else {
            column.toggleSorting(false)
          }
        }}
        disabled={isLoading || recordCount === 0}
      >
        {title}

        {column.getCanSort() &&
          (column.getIsSorted() === "desc" ? (
            <ArrowDown className="size-3 mt-px" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="size-3 mt-px" />
          ) : (
            <ChevronsUpDown className="size-3 mt-px" />
          ))}
      </Button>
    )
  }

  const headerControls = () => {
    return (
      <div className="flex items-center h-full gap-1.5 justify-between w-full">
        {headerButton()}
        {column.getCanPin() && (
          <DataTablePinControls column={column} title={title} />
        )}
      </div>
    )
  }

  if (column.getCanPin()) {
    return headerControls()
  }

  if (column.getCanSort() || column.getCanResize()) {
    return <div className="flex items-center h-full">{headerButton()}</div>
  }
}

export { DataTableColumnHeader, type DataTableColumnHeaderProps }
