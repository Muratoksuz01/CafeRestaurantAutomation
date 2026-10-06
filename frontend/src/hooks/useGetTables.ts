import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';
import { API_PATHS } from '@/lib/api';
import { AllTable } from '@/models/Tables';
import { ApiResponse } from '@/lib/apiTypes';

export function useGetTables() {
  const [tables, setTables] = useState<AllTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getTables() {
    setLoading(true);
    setError(null);
    try {
      // API İSTEĞİ (Aktif edildi)
      const res = await axiosInstance.get<ApiResponse<AllTable[]>>(API_PATHS.getTables);
      if (res.data.status && res.data.data) {
        setTables(res.data.data);
      } else {
        setTables([]);
      }

      /* MOCK DATA (Yorum satırına alındı)
      setTables([
        {
          _id: "66f8211b8a9c3dc4e5f6a7b8c",
          name: "Masa 1 - Bahçe",
          status: "dolu",
          currentOrderId: "ord_9876543210",
          orderCreated: "2026-09-28T18:30:00Z",
          orderTotal: 1250.5,
          waiterName: "Ahmet Yılmaz",
        },
        {
          _id: "66f8211b8a9c3d4e5fs6a7b8d",
          name: "Masa 2 - Salon",
          status: "dolu",
          currentOrderId: "ord_9876543211",
          orderCreated: "2026-09-28T19:15:00Z",
          orderTotal: 480.0,
        },
        {
          _id: "66f8211b8a9c3d4se5f6a7b8e",
          name: "Masa 3 - Teras",
          status: "bos",
          currentOrderId: "",
          orderCreated: "",
        },
        {
          _id: "66f8211b8a9c3d4ef5f6a7b8f",
          name: "Masa 4 - VIP",
          status: "bos",
          currentOrderId: "",
          orderCreated: "",
          waiterName: "Mehmet Demir",
        },
        {
          _id: "66f8211b8a9c3d4we5f6a7b90",
          name: "Masa 5 - Salon",
          status: "dolu",
          currentOrderId: "ord_9876543212",
          orderCreated: "2026-09-28T20:00:00Z",
          orderTotal: 0,
          waiterName: "Ayşe Kaya",
        },
      ]);
      */
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setTables([]);
    } finally {
      setLoading(false);
    }
  }

  return { tables, loading, error, setTables, getTables };
}
