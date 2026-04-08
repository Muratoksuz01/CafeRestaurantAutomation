import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "@/pages/Dashboard/components/CustomFormField"

import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { successStyle } from "@/lib/toastStyle"
import { tableCreateEditSchema } from "@/models/Tables"
import CustomDialog from "../components/CustomDialog"

interface TableFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  table?: any // Eğer bu varsa 'Düzenle', yoksa 'Ekle' modundadır
}

const TableFormDialog = ({ open, onOpenChange, onSuccess, table }: TableFormDialogProps) => {
  const isEditMode = !!table?._id

  const form = useForm({
    resolver: zodResolver(tableCreateEditSchema),
    defaultValues: {
      name: "",
    },
  })

  // Table değiştiğinde veya modal açıldığında formu resetle
  useEffect(() => {
    if (open) {
      form.reset({
        name: table?.name || "",
      })
    }
  }, [table, open, form])

  const onSubmit = async (data: any) => {
    try {
      const request = isEditMode
        ? axiosInstance.put(API_PATHS.editTable(table._id), data)
        : axiosInstance.post(API_PATHS.createTable, data)

      const res = await request

      // Backend'den dönen başarı flag'lerini kontrol et (status veya success)
      if (res.data.status ) {
        toast.success(
          isEditMode ? "Masa güncellendi" : "Masa eklendi",
          successStyle
        )
        if (onSuccess) await onSuccess()
        onOpenChange(false)
        form.reset()
      }
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu")
    }
  }

  return (

    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      confirmText={isEditMode ? "Güncelle" : "Ekle"}
      title={isEditMode ? "Masayı Düzenle" : "Yeni Masa Ekle"}
      onConfirm={() => { onSubmit(form.getValues()) }}
      description={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              title="Masa İsmi"
              control={form.control}
              name="name"
            >
              {(field: any) => (
                <Input
                  {...field}
                  placeholder="Örn: Masa 1"
                  autoComplete="off"
                />
              )}
            </CustomFormField>

            
          </form>
        </Form>
      }
    />

  )
}

export default TableFormDialog