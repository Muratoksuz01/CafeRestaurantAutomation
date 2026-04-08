'use client'

import { useState } from 'react'
import { CalendarIcon, ChevronDownIcon, X } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { tr } from 'date-fns/locale'  // date-fns locale import

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
                        <span className="flex items-center gap-2">
                           {/*  {range?.from && range?.to && (
                                <X
                                    className="h-4 w-4 cursor-pointer"
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()

                                        setRange(undefined)

                                        const start = new Date()
                                        start.setHours(0, 0, 0, 0)

                                        const end = new Date()
                                        end.setHours(23, 59, 59, 999)

                                        onChange?.({ from: start, to: end })
                                    }}
                                />

                            )} */}

                            <CalendarIcon className="h-4 w-4" />

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
                        locale={tr}
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
