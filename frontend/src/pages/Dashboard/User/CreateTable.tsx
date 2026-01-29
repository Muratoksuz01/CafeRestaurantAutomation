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
import {  useForm } from "react-hook-form"
import { toast } from "sonner"

function CreateTable({ createOpen, setCreateOpen, onCreate }: any) {

  const form = useForm({
    resolver: zodResolver(tableCreateEditSchema),
    
  })





  const onsubmit = async (data: any) => {
    const res = await axiosInstance.post(API_PATHS.createTable, data)
    if (res.data.success) {
      toast.success("Masa eklendi", successStyle)
      if (onCreate) onCreate()
    }
   form. reset()
    setCreateOpen(false)
  }


  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Masa Ekle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="flex flex-col gap-4">
            <CustomFormField title="Masa İsmi" control={form.control} name={"name"}>
              {(field: any) => (
                  <Input
                    {...field}
                  />
                )}
            </CustomFormField>
            <Button type="submit">Ekle</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTable
