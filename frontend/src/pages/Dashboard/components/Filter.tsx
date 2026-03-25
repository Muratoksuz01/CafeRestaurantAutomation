import { Column } from "@tanstack/react-table"
import { useId, useMemo } from "react"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { SearchIcon } from "lucide-react"

function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId()
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : ''

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'range') return []

    const values = Array.from(column.getFacetedUniqueValues().keys())

    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr]
      }

      return [...acc, curr]
    }, [])

    return Array.from(new Set(flattenedValues)).sort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFacetedUniqueValues(), filterVariant])

  if (filterVariant === 'range') {
    return (
      <div className='*:not-first:mt-2'>
        <Label>{columnHeader}</Label>
        <div className='flex'>
          <Input
            id={`${id}-range-1`}
            className='flex-1 rounded-r-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none'
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={e =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1]
              ])
            }
            placeholder='Min'
            type='number'
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className='-ms-px flex-1 rounded-l-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none'
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={e =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined
              ])
            }
            placeholder='Max'
            type='number'
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    )
  }

  if (filterVariant === 'select') {
    return (
      <div className='*:not-first:mt-2'>
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? 'all'}
          onValueChange={value => {
            column.setFilterValue(value === 'all' ? undefined : value)
          }}
        >
          <SelectTrigger id={`${id}-select`} className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tümü</SelectItem>
            {sortedUniqueValues.map(value => (
              <SelectItem className="capitalize" key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className='*:not-first:mt-2'>
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className='relative'>
        <Input
          id={`${id}-input`}
          className='peer pl-9'
          value={(columnFilterValue ?? '') as string}
          onChange={(e: any) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type='text'
        />
        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  )
}
export default Filter