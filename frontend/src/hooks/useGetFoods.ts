import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';
import { API_PATHS } from '@/lib/api';
import { Food } from '@/models/Food';
import { ApiResponse } from '@/lib/apiTypes';

export function useGetFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getFoods() {
    setLoading(true);
    setError(null);
    try {
      // API İSTEĞİ (Aktif edildi)
      const res = await axiosInstance.get<ApiResponse<Food[]>>(API_PATHS.getFoods);
      if (res.data.status && res.data.data) {
        setFoods(res.data.data);
      } else {
        setFoods([]);
      }

      /* MOCK DATA (Yorum satırına alındı)
      setFoods([
        { _id: 1, name: "ali", price: 12, description: "", categoryId: "", imgs: 1 },
      ]);
      */
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }

  return { foods, loading, error, setFoods, getFoods };
}
