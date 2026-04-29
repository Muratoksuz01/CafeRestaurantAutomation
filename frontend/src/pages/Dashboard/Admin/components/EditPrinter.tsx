import { printerCreateEditSchema, Printers } from '@/models/Food'
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
import { User, Shield } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import CustomDialog from "../../components/CustomDialog"

interface EditDialogProps {
    open: boolean
    setOpenEdit: (open: boolean) => void
    printer: Printers
    onSuccess: () => void
}
function EditPrinter({ open, setOpenEdit, printer, onSuccess }: EditDialogProps) {
    const form = useForm<z.infer<typeof printerCreateEditSchema>>({
        resolver: zodResolver(printerCreateEditSchema),
        defaultValues: {
            name: printer.name || "",
            printerIp: printer.printerIp || "",
            printerType: printer.printerType || "",
        },
    })

    useEffect(() => {
        if (!printer) return

        form.reset({
            name: printer.name || "",
            printerIp: printer.printerIp || "",
            printerType: printer.printerType || "",
        })
    }, [printer, form])

    const handleSave = async (data: z.infer<typeof printerCreateEditSchema>) => {
        console.log("[v0] Form submitted:", data)
        // TODO: Add API call here
        const res = await axiosInstance.put(API_PATHS.updatePrinter(String(printer._id)), data)
        if (res.data.status) {
            onSuccess && onSuccess()
            toast.success("kullanıcı basarlılı guncellendi", successStyle)
            setOpenEdit(false)
            return
        }
        else {
            toast.warning(res.data.message || "işlem hatası ", warningStyle)
        }
    }



    return (
        <CustomDialog
            open={open}
            onOpenChange={setOpenEdit}
            title="Yazıcıyı Düzenle"
            // onConfirm={() => {handleSave(form.getValues())}}
            description={
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
                        {/* Name Fields Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <CustomFormField control={form.control} name="name" title="Yazıcı ismi">
                                {(field: any) => (
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input {...field}  className="pl-9" />
                                    </div>
                                )}
                            </CustomFormField>

                            <CustomFormField control={form.control} name="printerIp" title="Yazıcı Ip">
                                {(field: any) => <Input {...field}  />}
                            </CustomFormField>
                        </div>

                       

                        {/* Role Field */}
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

export default EditPrinter