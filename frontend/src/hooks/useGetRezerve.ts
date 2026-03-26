import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';
import { API_PATHS } from '@/lib/api';
import { ApiResponse } from '@/lib/apiTypes';
// src/hooks/useProducts.ts




export function useGetRezerve() {
  const [rezerve, setRezerve] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getRezerve() {
    try {
      const res = await axiosInstance.get<ApiResponse>(API_PATHS.getRezervasyonlar); // buraya auth koruması sadece admin ise ulasabilecek sekilde ayarlanacak
      if (res.data.status && res.data.data) {
        setRezerve(res.data.data);        
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setRezerve([]);

    } finally {
      setLoading(false);
    }
  }
  return { rezerve, loading, error, setRezerve ,getRezerve};
}


