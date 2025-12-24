import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, Info, Loader2 } from "lucide-react"
import { useGetOrders } from "@/hooks/usegetOrders"
import { Order } from "@/models/Order"
import { ColumnDef } from "@tanstack/react-table"
import CustomDataTable from "@/components/CustomDataTable"
import { OrderDetailsDialog } from "../Admin/OrderDetailsDialog"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function AsciOrders() {
  const { orders, loading, error, getOrders } = useGetOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // For completion confirmation
  const [orderToComplete, setOrderToComplete] = useState<string | null>(null)
  const [openAlert, setOpenAlert] = useState(false)

 useEffect(() => {
  getOrders()

  const interval = setInterval(getOrders, 30000) // 30 sn

  return () => clearInterval(interval)
}, [])


  const columns: ColumnDef<Order>[] = [
    {
      id: "Sıra",
      header: "Sıra",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "tableName",
      header: "Masa İsmi",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tableName")}</div>
      ),
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sipariş Tarihi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">
          {new Date(row.getValue("orderDate")).toLocaleString("tr-TR")}
        </div>
      ),
    },
    {
      id: "İşlemler",
      header: "İşlemler",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleInfoClick(order.id)}
            >
              <Info className="mr-2 h-4 w-4" />
              Detay
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOrderToComplete(order.id)
                setOpenAlert(true)
              }}
            >
              Tamamlandı
            </Button>
          </div>
        )
      },
    },
  ]

  const handleComplete = async (id: string) => {
    try {
      const res = await axiosInstance.put(API_PATHS.updateOrder(id))
      if (res.data.success) {
        toast.success("Sipariş tamamlandı olarak işaretlendi", successStyle)
        getOrders() // Refresh the list
      } else {
        toast.warning("Bir hata oluştu", warningStyle)
        console.log(res.data.message)
      }
    } catch (error) {
      toast.warning("Sipariş güncellenirken hata oluştu", warningStyle)
      console.error(error)
    } finally {
      setOpenAlert(false)
      setOrderToComplete(null)
    }
  }

  const handleInfoClick = (orderId: string) => {
    setSelectedOrderId(orderId)
    setDialogOpen(true)
  }

  const filterOrdersByStatus = (status: Order["status"]) => {
    return orders.filter((order) => order.status === status)
  }

  const renderOrdersTable = (filteredOrders: Order[]) => {
    if (filteredOrders.length === 0) {
      return (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          Bu durumda sipariş bulunmuyor
        </div>
      )
    }

    return <CustomDataTable columns={columns} data={filteredOrders} />
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hazirlaniyorOrders = filterOrdersByStatus("hazirlaniyor")
  const tamamlandiOrders = filterOrdersByStatus("tamamlandi")
  const iptalEdildiOrders = filterOrdersByStatus("iptal edildi")

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sipariş Yönetimi</CardTitle>
          <CardDescription>
            Siparişleri durumlarına göre görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hazirlaniyor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hazirlaniyor">
                Hazırlanıyor ({hazirlaniyorOrders.length})
              </TabsTrigger>
              <TabsTrigger value="tamamlandi">
                Tamamlandı ({tamamlandiOrders.length})
              </TabsTrigger>
              <TabsTrigger value="iptal-edildi">
                İptal Edildi ({iptalEdildiOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hazirlaniyor" className="mt-6">
              {renderOrdersTable(hazirlaniyorOrders)}
            </TabsContent>

            <TabsContent value="tamamlandi" className="mt-6">
              {renderOrdersTable(tamamlandiOrders)}
            </TabsContent>

            <TabsContent value="iptal-edildi" className="mt-6">
              {renderOrdersTable(iptalEdildiOrders)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <OrderDetailsDialog
        orderId={selectedOrderId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Confirmation Alert for completing order */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siparişi Tamamla?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu siparişi "Tamamlandı" olarak işaretlemek istediğinizden emin misiniz? 
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToComplete(null)}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => orderToComplete && handleComplete(orderToComplete)}
            >
              Evet, Tamamla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AsciOrders