'use client'

import { useState } from 'react'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const DatePickerRangeDemo = ({
    onChange,
}: {
    onChange?: (range: DateRange | undefined) => void
}) => {
    const [range, setRange] = useState<DateRange | undefined>()

    return (
        <div className="w-full max-w-xs space-y-2">
            <Label className="px-1">Tarih Aralığı</Label>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                    >
                        <span className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {range?.from && range?.to
                                ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                                : 'Tarih seç'}
                        </span>

                        <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>


                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={(r) => {
                            setRange(r)
                            onChange?.(r)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DatePickerRangeDemo
