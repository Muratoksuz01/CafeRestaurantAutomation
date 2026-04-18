import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { foodCreateSchema } from "@/models/Food";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Select, SelectContent , SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Form } from "@/components/ui/form";
import CustomFormField from "@/pages/Dashboard/components/CustomFormField";
import CustomDialog from "../../components/CustomDialog";
import { toast } from "sonner";
import { successStyle } from "@/lib/toastStyle";

export default function CreateFoodForm({ onUpdate, open, setOpen }: any) {
  const [loading, setLoading] = useState(false);
  const { categories, getCategories } = useGetCategory()
  const form = useForm({
    resolver: zodResolver(foodCreateSchema),
  });
  useEffect(() => {
    getCategories()
  }, [])

  const onSubmit = async (data: any) => {
    console.log("vdsvd")
    console.log(data);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("categoryId", data.categoryId);
      formData.append("description", data.description);
      for (let i = 0; i < data.imgs.length; i++) {
        formData.append("imgs", data.imgs[i]); // multiple file
      }

      await axiosInstance.post(API_PATHS.createFood, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      form.reset();
      console.log("Yemek oluşturuldu");
      onUpdate?.();
      setOpen(false)
      toast.success("temek basrılı seklide eklendi ",successStyle)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (


    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      title="Yeni Yemek Ekle"
      description={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">

            <CustomFormField control={form.control} name="name" title="Yemek adı">
              {(field: any) => (
                <Input placeholder="Yemek Adı" {...field} />
              )}
            </CustomFormField>

            <CustomFormField control={form.control} name="price" title="Yemek Fiyatı">
              {(field: any) => (
                <Input
                  type="number"
                  placeholder="Fiyat"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            </CustomFormField>

            <CustomFormField control={form.control} name="description" title="Yemek Acıklaması">
              {(field: any) => (
                <Textarea placeholder="Açıklama" {...field} />
              )}
            </CustomFormField>

            <CustomFormField control={form.control} name="imgs" title="Yemeğin resimleri">
              {(field: any) => (
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              )}
            </CustomFormField>

            <CustomFormField control={form.control} name="categoryId" title="Yemegin kategorisi">
              {(field: any) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Kategori seç" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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