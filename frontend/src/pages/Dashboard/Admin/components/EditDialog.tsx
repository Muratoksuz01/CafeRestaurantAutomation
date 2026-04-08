"use client"


import { useEffect } from "react"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/pages/Dashboard/components/CustomFormField"
import { type Users, userEditSchema } from "@/models/User"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Shield, Power } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import CustomDialog from "../../components/CustomDialog"

interface EditDialogProps {
  open: boolean
  setOpenEdit: (open: boolean) => void
  user: Users
  onSuccess: () => void
}

function EditDialog({ open, setOpenEdit, user, onSuccess }: EditDialogProps) {
  const form = useForm<z.infer<typeof userEditSchema>>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      roleName: user.roleName ?? "Garson",
      isActive: user.isActive ?? false,
    },
  })

 useEffect(() => {
  if (!user) return

  form.reset({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    roleName: user.roleName ?? "Garson",
    isActive: user.isActive ?? false,
  })
}, [user, form])




  const handleSave = async (data: z.infer<typeof userEditSchema>) => {
    console.log("[v0] Form submitted:", data)
    // TODO: Add API call here
    const res=await axiosInstance.put(API_PATHS.updateUser(String(user._id)),data)
    if(res.data.status){
      onSuccess && onSuccess()
      toast.success("kullanıcı basarlılı guncellendi",successStyle)
      setOpenEdit(false)
      return
    }
    else{
      toast.warning(res.data.message || "işlem hatası ",warningStyle)
    }
  }

  return (

    <CustomDialog 
    open={open}
    onOpenChange={setOpenEdit}
    title="Kullanıcıyı Düzenle"
   // onConfirm={() => {handleSave(form.getValues())}}
    description={
       <Form  {...form}>
          <form  onSubmit={form.handleSubmit(handleSave)}   className="space-y-5">
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField control={form.control} name="firstName" title="Ad">
                {(field: any) => (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} placeholder="Ahmet" className="pl-9" />
                  </div>
                )}
              </CustomFormField>

              <CustomFormField control={form.control} name="lastName" title="Soyad">
                {(field: any) => <Input {...field} placeholder="Yılmaz" />}
              </CustomFormField>
            </div>

            {/* Email Field */}
            <CustomFormField control={form.control} name="email" title="E-posta">
              {(field: any) => (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input {...field} type="email" placeholder="ornek@email.com" className="pl-9" />
                </div>
              )}
            </CustomFormField>

            {/* Phone Field with formatting */}
            <CustomFormField control={form.control} name="phoneNumber" title="Telefon Numarası">
              {(field: any) => (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="555-555-5555"
                    className="pl-9"
                    
                    maxLength={13}
                  />
                </div>
              )}
            </CustomFormField>

            {/* Role Field */}
            <CustomFormField control={form.control} name="roleName" title="Rol">
              {(field: any) => (
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yonetici">Yönetici</SelectItem>
                      <SelectItem value="Garson">Garson</SelectItem>
                      <SelectItem value="Kasiyer">Kasiyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CustomFormField>

            {/* Active Status Toggle */}
            <CustomFormField control={form.control} name="isActive" title="Kullanıcı Durumu">
              {(field: any) => (
                <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Power className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">{field.value ? "Aktif" : "Pasif"}</Label>
                      <p className="text-xs text-muted-foreground">
                        {field.value ? "Kullanıcı sisteme giriş yapabilir" : "Kullanıcı sisteme giriş yapamaz"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
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

export default EditDialog
