import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';
import { API_PATHS } from '@/lib/api';
// src/hooks/useProducts.ts

type Actions ={
  _id:string
  code:string,
  description:string,
}


export function useGetPermissions() {
  const [permissions, setPermissions] = useState<Actions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getPermissions() {
    try {
      const res = await axiosInstance.get(API_PATHS.getPermissions); // buraya auth koruması sadece admin ise ulasabilecek sekilde ayarlanacak
    //  console.log(res.data.data)
      if (res.data.success && res.data.data) {
        setPermissions(res.data.data);
      //  console.log("basrılı");
        
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setPermissions([]);

    } finally {
      setLoading(false);
    }
  }
  return { permissions, loading, error, setPermissions ,getPermissions};
}


