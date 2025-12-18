"use client"

import CustomFormField from "@/components/CustomFormField"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { API_PATHS } from "@/lib/api"
import axiosInstance from "@/lib/axiosInstance"
import { successStyle } from "@/lib/toastStyle"
import { tableCreateEditSchema } from "@/models/Tables"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

function EditTable({ editOpen, setEditOpen, onEdit, selectetTable }: any) {
  const form = useForm({
    resolver: zodResolver(tableCreateEditSchema),
    defaultValues: {
      name: selectetTable.name || "",
    },
  })

  useEffect(() => {
    if (selectetTable) {
      form.reset({
        name: selectetTable.name,
      })
    }
  }, [selectetTable])

  const onsubmit = async (data: any) => {
    const res = await axiosInstance.put(API_PATHS.editTable(selectetTable._id),data)

    if (res.data.success) {
      toast.success("Masa güncellendi", successStyle)
      if (onEdit) onEdit()
    }

    form.reset()
    setEditOpen(false)
  }

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Masa Düzenle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="flex flex-col gap-4">
            <CustomFormField control={form.control} name="name">
              {(field: any) => (
                <Input {...field} />
              )}
            </CustomFormField>
            <Button type="submit">Kaydet</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTable
