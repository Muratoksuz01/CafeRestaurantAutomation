import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { foodSchema } from "@/models/Food";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
export default function CreateFoodForm() {
    const [loading, setLoading] = useState(false);
    const { categories, getCategories } = useGetCategory()
    const { register, handleSubmit,control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(foodSchema),
    });
    useEffect(() => {
        getCategories()
    }, [])

    const onSubmit = async (data: any) => {
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
            reset();
            console.log("Yemek oluşturuldu");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
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
                <Input type="file"   {...register("imgs")} multiple accept="image/*" />
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
            <Button type="submit" disabled={loading}>{loading ? "Yükleniyor..." : "Oluştur"}</Button>
        </form>
    );
}