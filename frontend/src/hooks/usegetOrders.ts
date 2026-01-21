import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { Order } from "@/models/Order"
import { DateRange } from "react-day-picker"

export function useGetOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  async function getOrders() {
    try {
      const res = await axiosInstance.get(API_PATHS.getOrders)
      if (res.data.success && res.data.data) {
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
    console.log("caliştir")
    if (!range?.from || !range?.to) return
    try {
      const res = await axiosInstance.post(API_PATHS.orderbydate, {
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      })
      if (res.data.success && res.data.data) {
        setOrders(res.data.data)
      }

    } catch (error: any) {
      setError(error.message || "Veri alınamadı")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }
  return { orders, loading, error, setOrders, getOrders, getOrdersByDate }
}
