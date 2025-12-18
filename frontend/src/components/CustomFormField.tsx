import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
interface CustomFormFieldProps {
  control: any
  name: string
  title: string
  children: (field: any) => React.ReactNode
}
function CustomFormField({ control, children, name, title }: CustomFormFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-slate-700 font-medium">{title}</FormLabel>
                    <FormControl>
                        {children(field)}
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField

