import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';
import { API_PATHS } from '@/lib/api';
import { MyTable } from '@/models/Tables';
// src/hooks/useProducts.ts




export function useGetTables() {
  const [tables, setTables] = useState<MyTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getTables() {
    try {
      const res = await axiosInstance.get(API_PATHS.getTables); // buraya auth koruması sadece admin ise ulasabilecek sekilde ayarlanacak
      console.log(res.data.data)
      if (res.data.success && res.data.data) {
        setTables(res.data.data);
        console.log("basrılı");
        
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setTables([]);

    } finally {
      setLoading(false);
    }
  }
  return { tables, loading, error, setTables ,getTables};
}


