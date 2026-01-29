"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Order } from "@/models/Order"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { toast } from "sonner"
import { warningStyle } from "@/lib/toastStyle"
import CustomDialog from "@/components/CustomDialog"

interface OrderDetailsDialogProps {
    orderId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ orderId, open, onOpenChange }: OrderDetailsDialogProps) {
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<Order>()
    const fetchOrder = async (id: string) => {
        try {
            setLoading(true)
            const res = await axiosInstance.get(API_PATHS.getOrder(id))
            if (res.data.success) {
                setOrder(res.data.data)
            } else {
                toast.warning(res.data.message || " sipariş getirilirken bir hata olustu", warningStyle)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (orderId && open) {
            fetchOrder(orderId)
        }
    }, [orderId, open])






    return(
        <div>
        <CustomDialog open={open}
        className="max-w-2xl"
         onOpenChange={onOpenChange} 
         title={"Sipariş Detayları"} isInfo={true}
         description={
            <div>
                 {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {order && !loading && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Masa Adı</p>
                                <p className="font-medium">{order.tableName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tarih</p>
                                <p className="font-medium">{new Date(order.orderDate).toLocaleString("tr-TR")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Durum</p>
                                <p className="font-medium capitalize">{order.status}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Toplam</p>
                                <p className="font-medium">{order.orderTotal.toFixed(2)} ₺</p>
                            </div>
                        </div>

                        {order.orderItems && order.orderItems.length > 0 && (
                            <div>
                                <h3 className="mb-3 font-semibold">Sipariş Ürünleri</h3>

                                <div className="space-y-3">
                                    {order.orderItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between rounded-xl border p-4"
                                        >
                                            {/* Sol taraf */}
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={`http://localhost:5000/file?path=${item.imgs}`}
                                                    alt=""
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                />

                                                <div>
                                                    <p className="font-medium leading-tight">
                                                        {item.foodName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Adet: {item.qty}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Sağ taraf */}
                                            <p className="font-semibold whitespace-nowrap">
                                                {item.total.toFixed(2)} ₺
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
         }
          />
        </div>
    )
}
