"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useGetCategory } from "@/hooks/useGetCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { foodEditSchema, foodSchema } from "@/models/Food";
import { Textarea } from "@/components/ui/textarea";
import { useGetFoods } from "@/hooks/useGetFoods";


interface EditFoodFormProps {
  food: any;
  onClose: () => void;
  onUpdate?: (updatedFood: any) => void; // listeyi güncellemek için
}

export default function EditFoodForm({ food, onClose, onUpdate }: EditFoodFormProps) {

  const { categories, getCategories } = useGetCategory()
  useEffect(() => {
    getCategories()
  }, [])
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(foodEditSchema),
    defaultValues: {
      name: food?.name || "",
      price: food?.price || "",
      description: food?.description || "",
      categoryId: food?.categoryId || "",
      // imgs: [] // Edit'te yeni resim seçilirse override eder
    },
  });

  const onSubmit = async (data: any) => {
    console.log("IMGS:", data.imgs);
    console.log("instanceof FileList:", data.imgs instanceof FileList);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("categoryId", data.categoryId);
      formData.append("description", data.description);
      for (let i = 0; i < data.imgs.length; i++) {
        formData.append("imgs", data.imgs[i]); // multiple file
      }


      const res = await axiosInstance.put(API_PATHS.updateFood(food._id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

      );

      if (res.data.success) {
        toast.success("Yemek güncellendi", successStyle);
        onUpdate?.(data.data); // üst componentte listeyi güncelle
        onClose();
        reset()
      }
    } catch (err: any) {
      toast.warning(err.message || "Hata", warningStyle);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <Input placeholder="Yemek Adı" {...register("name")} />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Input type="number" placeholder="Fiyat" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Textarea placeholder="Açıklama" {...register("description")} />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <Input type="file" multiple accept="image/*"  {...register("imgs")} />
          {errors.imgs && (errors.imgs as any)?.message && (
            <p className="text-red-600 text-sm mt-1">{(errors.imgs as any).message}</p>
          )}
        </div>
        <div>
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: "Kategori seçmelisiniz" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" type="button" onClick={onClose}>İptal</Button>
          <Button type="submit">Kaydet</Button>
        </div>
      </div>
    </form>
  );
}
