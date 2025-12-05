import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { successStyle } from "@/lib/toastStyle";
import { tableCreateEditSchema } from "@/models/Tables"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateTable({ createOpen, setCreateOpen, onCreate }: any) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(tableCreateEditSchema),
  });

  const onsubmit =async (data: any) => {
    // üst component create isteğini gönderecek
   const res= await axiosInstance.post(API_PATHS.createTable,data)
   if(res.data.success){
     toast.success("masa eklendi",successStyle)
     if (onCreate) onCreate();
   }
    reset();  
    setCreateOpen(false); 
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Masa Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <Label>Masa Adı</Label>
            <Input {...register("name")} />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          <Button type="submit">Ekle</Button>
        </form>

      </DialogContent>
    </Dialog>
  );
}

export default CreateTable;
