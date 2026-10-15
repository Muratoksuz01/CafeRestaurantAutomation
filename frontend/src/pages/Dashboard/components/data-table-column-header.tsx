import { type Column } from "@tanstack/react-table"
import {  ArrowUpDown, } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  
}: DataTableColumnHeaderProps<TData, TValue>) {




  return (
    <Button
      variant={"ghost"}
      onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
    >
      {title}
      <ArrowUpDown />
    </Button>

  )
}
