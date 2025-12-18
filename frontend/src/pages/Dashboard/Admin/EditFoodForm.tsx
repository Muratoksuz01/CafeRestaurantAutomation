"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField"
import { API_PATHS } from "@/lib/api"
import axiosInstance from "@/lib/axiosInstance"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import { useGetCategory } from "@/hooks/useGetCategory"
import { zodResolver } from "@hookform/resolvers/zod"
import { foodEditSchema } from "@/models/Food"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface EditFoodFormProps {
  food: any
  onClose: () => void
  onUpdate?: () => void
}

export default function EditFoodForm({ food, onClose, onUpdate }: EditFoodFormProps) {
  const { categories, getCategories } = useGetCategory()

  useEffect(() => {
    getCategories()
  }, [])

  const form = useForm({
    resolver: zodResolver(foodEditSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      categoryId: "",
      imgs: undefined,
    },
  })

  useEffect(() => {
    if (food) {
      form.reset({
        name: food.name,
        price: food.price,
        description: food.description,
        categoryId: food.categoryId,
      })
    }
  }, [food])

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("price", data.price.toString())
      formData.append("categoryId", data.categoryId)
      formData.append("description", data.description)

      if (data.imgs) {
        for (let i = 0; i < data.imgs.length; i++) {
          formData.append("imgs", data.imgs[i])
        }
      }

      const res = await axiosInstance.put(
        API_PATHS.updateFood(food._id),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      if (res.data.success) {
        toast.success("Yemek güncellendi", successStyle)
        onUpdate?.()
        onClose()
        form.reset()
      }
    } catch (err: any) {
      toast.warning(err.message || "Hata", warningStyle)
    }
  }

  return (
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

        <CustomFormField control={form.control} name="imgs" title="Yemege ait resimler">
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

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit">Kaydet</Button>
        </div>

      </form>
    </Form>
  )
}
