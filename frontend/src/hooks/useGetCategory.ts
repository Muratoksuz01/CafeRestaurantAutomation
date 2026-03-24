// src/hooks/useGetCategory.ts

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { Category } from "@/models/Food";
import { ApiResponse } from "@/lib/apiTypes";

export function useGetCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getCategories() {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get<ApiResponse<Category[]>>(API_PATHS.getCategories);

      if (res.data.status) {
        setCategories(res.data.data || []);
      } else {
        setCategories([]);
        setError("Başarısız istek");
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    categories,
    loading,
    error,
    getCategories,
    setCategories,
  };
}
