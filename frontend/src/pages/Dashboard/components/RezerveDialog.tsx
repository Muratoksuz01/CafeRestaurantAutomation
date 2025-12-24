import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {  } from "@/models/User";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { toast } from "sonner";
import { successStyle } from "@/lib/toastStyle";

function RezerveDialog({ showRezerveDialog, setShowRezerveDialog, onChange }: any) {
    const now = new Date();
    const form = useForm({
        resolver: zodResolver(rezerveSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            untilTime: now,
        },
    });

    const onSubmit = (data: any) => {
        console.log(data);
        setShowRezerveDialog(false);
        toast.success("basrılı", successStyle)
        form.reset()
    };
    /*  const handleBook = async (id: string) => {
       console.log("rezrve edilen masa id:", id);
       // burada orderd varsa baska işlemler yapılmalı bu işi kontrol edilmeli
       const res = await axiosInstance.put(API_PATHS.handleBook(id))
       if (res.data.success) {
         toast.success(res.data.message || "işlem basarılı", successStyle)
         setOpen(false);
         onChange && onChange()
   
       } else {
         toast.success(res.data.message || "işlem basarısız", warningStyle)
   
       }
     } */
    return (
        <Dialog open={showRezerveDialog} onOpenChange={() => {
            setShowRezerveDialog(false)
            form.reset()
        }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Rezervasyon</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <CustomFormField control={form.control} name="firstName" title="Ad">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="lastName" title="Soyad">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="phoneNumber" title="Telefon">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="untilTime" title="Rezervasyon Saati">
                            {(field) => (
                                <Input
                                    type="datetime-local"
                                    value={
                                        field.value
                                            ? new Date(field.value).toISOString().slice(0, 16)
                                            : ""
                                    }
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            )}
                        </CustomFormField>

                        <Button type="submit" className="w-full">
                            Kaydet
                        </Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

export default RezerveDialog;
