import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/pages/Dashboard/components/CustomFormField"
import { userCreateSchema } from "@/models/User"
import { User, Mail, Phone, Shield, Power, EyeOff, Eye } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import { Switch } from '@/components/ui/switch'
import CustomDialog from '../../components/CustomDialog'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function CreateUserDialog({ open, setOpen, onSuccess }: any) {
    const [showPassword, setShowPassword] = useState(false)
    const form = useForm<z.infer<typeof userCreateSchema>>({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            roleName: undefined,
            isActive: true,
            password: ""
        },
    })
    const handleSave = async (data: z.infer<typeof userCreateSchema>) => {
        console.log("[v0] Form submitted:", data)
        // TODO: Add API call here
        const res = await axiosInstance.post(API_PATHS.createUser, data)
        if (res.data.status) {
            onSuccess && onSuccess()
            toast.success("kullanıcı basarlılı olusturuldu", successStyle)
            setOpen(false)
            return
        } else {
            toast.warning(res.data.message || "işlem hatası ", warningStyle)
        }
    }

    return (

        <CustomDialog
            open={open}
            onOpenChange={setOpen}
            title="Kullanıcıyı olustur"
            //  onConfirm={() => { handleSave(form.getValues()) }}
            description={
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">

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


                        <CustomFormField control={form.control} name="email" title="E-posta">
                            {(field: any) => (
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input {...field} type="email" placeholder="ornek@email.com" className="pl-9" />
                                </div>
                            )}
                        </CustomFormField>


                        <div className="grid grid-cols-2 gap-4">
                            <CustomFormField control={form.control} name="phoneNumber" title="Telefon Numarası">
                                {(field: any) => (
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            placeholder="555 555 5555"
                                            className="pl-9"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "") // sadece rakam
                                                if (/^\d{0,10}$/.test(value)) {
                                                    field.onChange(value)
                                                }
                                            }}
                                            maxLength={13}
                                        />
                                    </div>
                                )}
                            </CustomFormField>

                            <CustomFormField control={form.control} name={"password"} title="Sifre"  >
                                {(field: any) => (
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="bg-slate-50 border-slate-200  placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                )}
                            </CustomFormField>
                        </div>

                        <CustomFormField control={form.control} name="roleName" title="Rol">
                            {(field: any) => (
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="pl-9">
                                            <SelectValue placeholder="Rol seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asci">Aşçı</SelectItem>
                                            <SelectItem value="Yonetici">Yönetici</SelectItem>
                                            <SelectItem value="Garson">Garson</SelectItem>
                                            <SelectItem value="Kasiyer">Kasiyer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </CustomFormField>


                        <CustomFormField control={form.control} name="isActive" title="Kullanıcı Durumu">
                            {(field: any) => (
                                <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <Power className="h-4 w-4 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            {/* <Label className="text-sm font-medium">{field.value ? "Aktif" : "Pasif"}</Label> */}
                                            <p className="text-xs text-muted-foreground">
                                                {field.value ? "Kullanıcı sisteme giriş yapabilir" : "Kullanıcı sisteme giriş yapamaz"}
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={(val) => field.onChange(val)}
                                        className="data-[state=unchecked]:bg-red-200 data-[state=checked]:bg-green-500"
                                    />
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

export default CreateUserDialog