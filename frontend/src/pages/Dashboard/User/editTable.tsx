import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { successStyle } from "@/lib/toastStyle";
import { tableCreateEditSchema } from "@/models/Tables";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function editTable({ editOpen, setEditOpen, onEdit, selectetTable }: any) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(tableCreateEditSchema),
        defaultValues: {
            name: selectetTable?.name || "bilinmio  "
        }
    });
    useEffect(() => {
        console.log(selectetTable);

    }, [])
    const onsubmit = async (data: any) => {
        console.log(data)
        const res = await axiosInstance.put(API_PATHS.editTable(selectetTable._id), data)
        if (res.data.success) {
            toast.success("masa eklendi", successStyle)
            if (onEdit) onEdit();
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
                <form onSubmit={handleSubmit(onsubmit)}>
                    <div className="flex flex-col gap-3">
                        <Label>Masa Adı</Label>
                        <Input  {...register("name")} />
                        {errors.name && (
                            <span className="text-red-500 text-sm">{String(errors.name.message)}</span>
                        )}
                    </div>
                    <Button type="submit">Kaydet</Button>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default editTable