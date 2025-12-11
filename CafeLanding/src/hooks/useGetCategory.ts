// src/hooks/useGetCategory.ts

import axios from "axios";
import { useState } from "react";

export function useGetCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getCategories() {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("http://localhost:5000/api/admin/categories");

      if (res.data.success) {
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
