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
import { da } from "date-fns/locale";

function RezerveDialog({ masaId, showRezerveDialog, setShowRezerveDialog }: any) {
    const now = new Date();
    const form = useForm({
        resolver: zodResolver(rezerveSchema),
        defaultValues: {
            employeeName: "",
            employeePhone: "",
            description: "",
            startDate: now,
            endDate: undefined
        },
    });

    const onSubmit = async (veri: any) => {
        console.log(masaId)
        console.log(veri);
        const { data } = await axiosInstance.post<ApiResponse>(API_PATHS.handleBook, { masaId, ...veri })
        if (data.status) {
            setShowRezerveDialog(false);
            toast.success("basrılı", successStyle)
            form.reset()
        }else{
            console.error("rezerve edilirken hata var:",data.message)
            toast.warning(data.message || "rezerve edilirken hata olustu")
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

                        <CustomFormField control={form.control} name="description" title="Soyad">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="employeePhone" title="Telefon">
                            {(field) => <Input {...field} />}
                        </CustomFormField>

                        <CustomFormField control={form.control} name="endDate" title="Rezervasyon Saati">
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


                    </form>
                </Form>
            }
        />

    );
}

export default RezerveDialog;
