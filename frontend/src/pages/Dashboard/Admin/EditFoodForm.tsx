"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";

interface EditFoodFormProps {
  food: any;
  onClose: () => void;
  onUpdate?: (updatedFood: any) => void; // listeyi güncellemek için
}

export default function EditFoodForm({ food, onClose, onUpdate }: EditFoodFormProps) {
  const [name, setName] = useState(food.name);
  const [description, setDescription] = useState(food.description);
  const [price, setPrice] = useState(food.price);

  const handleSubmit = async () => {
    try {
      const { data } = await axiosInstance.put(API_PATHS.updateFood(food._id), {
        name,
        description,
        price,
      });

      if (data.success) {
        toast.success("Yemek güncellendi", successStyle);
        onUpdate?.(data.data); // üst componentte listeyi güncelle
        onClose();
      }
    } catch (err: any) {
      toast.warning(err.message || "Hata", warningStyle);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Yemek adı"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Input
        placeholder="Açıklama"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <Input
        placeholder="Fiyat"
        type="number"
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={onClose}>İptal</Button>
        <Button onClick={handleSubmit}>Kaydet</Button>
      </div>
    </div>
  );
}
