import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/pages/Dashboard/components/CustomFormField"
import { User, Shield } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import CustomDialog from '../../components/CustomDialog'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { printerCreateEditSchema } from '@/models/Food'
function CreatePrinter({ open, setOpen, onSuccess }: any) {
  const handleSave = async (data: z.infer<typeof printerCreateEditSchema>) => {
    console.log("[v0] Form submitted:", data)
    // TODO: Add API call here
    const res = await axiosInstance.post(API_PATHS.createPrinter, data)
    if (res.data.status) {
      onSuccess && onSuccess()
      toast.success("kullanıcı basarlılı olusturuldu", successStyle)
      setOpen(false)
      return
    } else {
      toast.warning(res.data.message || "işlem hatası ", warningStyle)
    }
  }
  const form = useForm<z.infer<typeof printerCreateEditSchema>>({
    resolver: zodResolver(printerCreateEditSchema),
    defaultValues: {
      name: "",
      printerIp: "",

    },
  })
  return (
    <CustomDialog
      open={open}
      onOpenChange={() => {
        form.reset()
        setOpen(false)
      }}
      title="Yazıcı olusvfvdtur"
      //  onConfirm={() => { handleSave(form.getValues()) }}
      description={
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField control={form.control} name="name" title="Yazıcı ismi">
                {(field: any) => (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} className="pl-9" placeholder="Kasiyer 1 yazıcı" />
                  </div>
                )}
              </CustomFormField>

              <CustomFormField control={form.control} name="printerIp" title="Yazıcı Ip">
                {(field: any) => (
                  <Input
                    {...field}
                    placeholder="192.168.1.100"
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9.]/g, ""); // Sadece rakam ve nokta

                      const blocks = value.split(".");

                      // 1. En fazla 4 blok olabilir (1.2.3.4 gibi)
                      if (blocks.length > 4) return;

                      // 2. Her blok 0-255 arası olmalı ve en fazla 3 haneli olmalı
                      const isValid = blocks.every((block) => {
                        if (block === "") return true; // Yazma anında boş olabilir
                        const num = parseInt(block, 10);
                        return num >= 0 && num <= 255 && block.length <= 3;
                      });

                      if (isValid) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              </CustomFormField>
            </div>



            <CustomFormField control={form.control} name="printerType" title="Yazıcı Tipi">
              {(field: any) => (
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Tip seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58">58</SelectItem>
                      <SelectItem value="80">80</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CustomFormField>



            <DialogFooter className=" flex gap-2 ">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  İptal
                </Button>
              </DialogClose>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </Form>
      }

    />
  )
}

export default CreatePrinter