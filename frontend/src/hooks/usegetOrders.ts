import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { Order } from "@/models/Order"
import { DateRange } from "react-day-picker"
import { ApiResponse } from "@/lib/apiTypes"

export function useGetOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  async function getOrders() {
    try {
      const res = await axiosInstance.get<ApiResponse<Order[]>>(API_PATHS.getOrders)
      if (res.data.status && res.data.data) {
        setOrders(res.data.data)
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  async function getOrdersByDate(range?: DateRange) {
    setLoading(true);
    setError(null);
    try {
      // 1. Query parametrelerini hazırla
      const params: any = {};
      if (range?.from && range?.to) {
        params.from = range.from.toISOString();
        params.to = range.to.toISOString();
      }

      // 2. İsteği at (params varsa axios bunu otomatik ?from=...&to=... şekline getirir)
      const res = await axiosInstance.get<ApiResponse<Order[]>>(API_PATHS.getOrders, { params });

      // 3. Backend'den dönen datayı set et
      // Not: Backend'de result dönerken interceptor kullandığın için res.data.data kontrolü yeterli
      if (res.data && res.data.status) {
        // Eğer interceptor datayı { success: true, data: [...] } yapıyorsa:
        const ordersData = (res.data as any).data || res.data;
        setOrders(ordersData);
      }
    } catch (err: any) {
      console.error("Sipariş yükleme hatası:", err);
      setError(err.message || "Veriler alınamadı");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }
  return { orders, loading, error, setOrders, getOrders, getOrdersByDate }
}
