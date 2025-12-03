import { getUser } from './../store/slices/authSlice';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '../models/User';
import { useState } from 'react';
import { API_PATHS } from '@/lib/api';
// src/hooks/useProducts.ts




export function useGetFoods() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getFoods() {
    try {
      const res = await axiosInstance.get(API_PATHS.getFoods); // buraya auth koruması sadece admin ise ulasabilecek sekilde ayarlanacak
      console.log(res.data.data)
      if (res.data.success && res.data.data) {
        setFoods(res.data.data);
        console.log("basrılı");
        
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setFoods([]);

    } finally {
      setLoading(false);
    }
  }
  return { foods, loading, error, setFoods ,getFoods};
}


