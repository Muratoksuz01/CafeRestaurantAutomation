
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/pages/Dashboard/components/CustomFormField"
import { API_BASE_URL, API_PATHS } from "@/lib/api"
import axiosInstance from "@/lib/axiosInstance"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import { useGetCategory } from "@/hooks/useGetCategory"
import { zodResolver } from "@hookform/resolvers/zod"
import { Food, foodEditSchema } from "@/models/Food"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import CustomDialog from "../../components/CustomDialog"
import { X } from "lucide-react";

interface EditFoodFormProps {
  food: Food
  onUpdate?: () => void
  open: any
  setOpen: any
}

export default function EditFoodForm({ food, onUpdate, open, setOpen }: EditFoodFormProps) {
  const { categories, getCategories } = useGetCategory()
  const [existingImages, setExistingImages] = useState<string[]>(food?.imgs || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  useEffect(() => {
    getCategories()
  }, [])

  const form = useForm({
    resolver: zodResolver(foodEditSchema),
    defaultValues: {
      name: food.name,
      price: food.price,
      description: food.description,
      categoryId: food.categoryId,
      imgs: [],
      existingImgs: food.imgs || []
    },
  })



 const onSubmit = async (data: any) => {
  try {

    const totalImages =
      (existingImages?.length || 0) +
      (newImages?.length || 0);

    if (totalImages === 0) {
      form.setError("imgs", {
        type: "manual",
        message: "En az bir resim olmalı"
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("categoryId", data.categoryId);
    formData.append("description", data.description || "");

    // yeni resimler
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append("imgs", file);
      });
    }

    // kalan eski resimler
    if (existingImages.length > 0) {
      existingImages.forEach((img) => {
        formData.append("existingImgs", img);
      });
    }

    const res = await axiosInstance.put(
      API_PATHS.updateFood(food._id.toString()),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status) {
      toast.success("Yemek güncellendi", successStyle);
      onUpdate?.();
      setOpen(false);
      form.reset();
      setNewImages([]);
      setExistingImages([]);
    }

  } catch (err: any) {
    toast.warning(err.message || "Hata", warningStyle);
  }
};
  return (
    <CustomDialog
      open={open}
      onOpenChange={() => {
        setOpen(false)
        form.reset()
      }}
      title="Mevcut Yemeği Düzenle"
      description={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <CustomFormField control={form.control} name="name" title="Yemek Adı">
              {(field: any) => <Input placeholder="Yemek Adı" {...field} />}
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
              {(field: any) => <Textarea placeholder="Açıklama" {...field} />}
            </CustomFormField>

            <CustomFormField control={form.control} name="imgs" title="Yemeğe ait resimler">
              {() => {

                const handleRemove = (index: number) => {
                  if (index < existingImages.length) {
                    // eski resim sil
                    const updated = existingImages.filter((_, i) => i !== index);
                    setExistingImages(updated);
                    form.setValue("existingImgs", updated);
                  } else {
                    // yeni resim sil
                    const newIndex = index - existingImages.length;
                    const updated = newImages.filter((_, i) => i !== newIndex);
                    setNewImages(updated);
                    form.setValue("imgs", updated);
                  }
                };

                const handleFileChange = (e: any) => {
                  const files = Array.from(e.target.files || []);
                  const total = existingImages.length + newImages.length + files.length;

                  if (total > 2) return;

                  const updated = [...newImages, ...files] as any;
                  setNewImages(updated);
                  form.setValue("imgs", updated);
                };

                const allImages = [
                  ...existingImages.map((img) => ({ src: `${API_BASE_URL}${img}` })),
                  ...newImages.map((file) => ({ src: URL.createObjectURL(file) }))
                ];

                return (
                  <div className="grid grid-cols-3 gap-3">

                    {[0, 1].map((i) => (
                      <div key={i} className="w-24 h-24 relative border rounded-lg overflow-hidden">

                        {allImages[i] ? (
                          <>
                            <img src={allImages[i].src} className="w-full h-full object-cover" />

                            <button
                              type="button"
                              onClick={() => handleRemove(i)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            Boş
                          </div>
                        )}

                      </div>
                    ))}

                    {/* INPUT */}
                    <label
                      className={`w-24 h-24 border rounded-lg flex items-center justify-center 
          ${allImages.length >= 2 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
                    >
                      <span className="text-xs text-gray-500">Resim ekle</span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={allImages.length >= 2}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                  </div>
                );
              }}
            </CustomFormField>

            <CustomFormField control={form.control} name="categoryId" title="Yemegin kategorisi">
              {(field: any) => {
                console.log(field.value)
                const selectedCategory = categories.find((c) => c._id === field.value);
                return (

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        {selectedCategory ? selectedCategory.name : "Kategori seç"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }

              }
            </CustomFormField>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => {
                setOpen(false)
              }}>
                İptal
              </Button>
              <Button type="submit">Kaydet</Button>
            </div>

          </form>
        </Form>
      }
    />




  )
}
