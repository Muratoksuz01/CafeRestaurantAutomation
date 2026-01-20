'use client'

import { useState } from 'react'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const DatePickerWithIconDemo = ({
  onChange,
}: {
  onChange?: (date: Date | undefined) => void
}) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label className="px-1">Tarih</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal">
            <span className="flex items-center">
              <CalendarIcon className="mr-2" />
              {date ? date.toLocaleDateString() : 'Tarih seç'}
            </span>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d)
              setOpen(false)
              onChange?.(d)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerWithIconDemo
