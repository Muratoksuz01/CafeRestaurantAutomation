import axiosInstance from '@/lib/axiosInstance';
import { Users } from '../models/User';
import { useState } from 'react';
import { API_PATHS } from '@/lib/api';
// src/hooks/useProducts.ts




export function useGetUsers() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getUsers() {
    try {
      const res = await axiosInstance.get(API_PATHS.getUsers); // buraya auth koruması sadece admin ise ulasabilecek sekilde ayarlanacak
    //  console.log(res.data.data)
      if (res.data.success && res.data.data) {
        setUsers(res.data.data);
      //  console.log("basrılı");
        
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setUsers([]);

    } finally {
      setLoading(false);
    }
  }
  return { users, loading, error, setUsers ,getUsers};
}


