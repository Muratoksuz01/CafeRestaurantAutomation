import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/pages/Dashboard/components/CustomFormField";
import { toast } from "sonner";
import { successStyle } from "@/lib/toastStyle";
import { rezerveSchema } from "@/models/Food";
import CustomDialog from "../../components/CustomDialog";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { ApiResponse } from "@/lib/apiTypes";
import { useEffect, useState } from "react";

function RezerveDialog({ masaId, showRezerveDialog, setShowRezerveDialog, onSuccess, setOpen }: any) {
    const [loading, setLoading] = useState(false)
    const now = new Date();
    const getLocalISOString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000; // Yerel saat farkı
        const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
        return localISOTime;
    };
    const form = useForm({
        resolver: zodResolver(rezerveSchema),
        defaultValues: {
            employeeName: "",
            employeePhone: "",
            description: "",
            // startDate: new Date(),
            endDate: new Date()
        },
    });
    useEffect(() => { if (showRezerveDialog) form.reset({ ...form.getValues(), endDate: new Date() }) }, [showRezerveDialog])
    const onSubmit = async (veri: any) => {
        console.log(masaId)
        console.log(veri);
        try {
            setLoading(true)
            const response = await axiosInstance.post<ApiResponse>(API_PATHS.handleBook, { masaId, ...veri })
            if (response.data.status) {
                setShowRezerveDialog(false);
                toast.success("basrılı", successStyle)
                form.reset()
                onSuccess()
                setOpen(false)
            } else {
                console.error("rezerve edilirken hata var:", response.data.message)
                toast.warning(response.data.message || "rezerve edilirken hata olustu")
            }

        } catch (error) {
            console.error("rezerve edilirken bilinmeyen bir haat olustu:", error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <CustomDialog
            open={showRezerveDialog}
            onOpenChange={() => {
                setShowRezerveDialog(false)
                form.reset()
            }}
            title="Rezervasyon"
            onConfirm={() => {
                onSubmit(form.getValues())
            }}
            description={
                <Form {...form}>
                    <form className="space-y-4">

                        <CustomFormField control={form.control} name="employeeName" title="Ad">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="employeePhone" title="Telefon">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="description" title="Acıklama">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="endDate" title="Rezervasyon Saati ve Günü">
                            {(field) => (
                                <Input
                                    type="datetime-local"
                                    // Yerel saati doğru formatta gösterir (UTC farkını korur)
                                    value={field.value ? getLocalISOString(new Date(field.value)) : ""}
                                    onChange={(e) => {
                                        const dateValue = e.target.value ? new Date(e.target.value) : new Date();
                                        field.onChange(dateValue);
                                    }}
                                />
                            )}
                        </CustomFormField>
                    </form>
                </Form>
            }
            footer={
                <div className="flex justify-end gap-4">

                    <Button onClick={form.handleSubmit(onSubmit)} type="submit" disabled={loading}>
                        {loading ? "Yükleniyor..." : "Oluştur"}
                    </Button>
                    <Button onClick={() => { setOpen(false) }} disabled={loading}>
                        İptal
                    </Button>
                </div>
            }
        />

    );
}

export default RezerveDialog;
