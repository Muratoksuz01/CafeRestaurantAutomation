import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsUpDown, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
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
