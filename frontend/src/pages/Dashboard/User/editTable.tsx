"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_PATHS } from "@/lib/api"
import axiosInstance from "@/lib/axiosInstance"
import { successStyle } from "@/lib/toastStyle"
import { tableCreateEditSchema } from "@/models/Tables"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

function EditTable({ editOpen, setEditOpen, onEdit, selectetTable, locations }: any) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tableCreateEditSchema),
    defaultValues: {
      name: selectetTable?.name || "",
    },
  })

  useEffect(() => {
    console.log(selectetTable)
  }, [])

  const onsubmit = async (data: any) => {
    console.log(data)
    const res = await axiosInstance.put(API_PATHS.editTable(selectetTable._id), data)
    if (res.data.success) {
      toast.success("masa güncellendi", successStyle)
      if (onEdit) onEdit()
    }
    reset()
    setEditOpen(false)
  }

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Masa Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Masa Adı</Label>
            <Input {...register("name")} />
            {errors.name && <span className="text-red-500 text-sm">{String(errors.name.message)}</span>}
          </div>

        

          <Button type="submit">Kaydet</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTable
