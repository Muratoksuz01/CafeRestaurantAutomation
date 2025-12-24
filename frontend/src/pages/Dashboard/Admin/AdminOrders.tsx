import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, Info, Loader2 } from "lucide-react"
import { useGetOrders } from "@/hooks/usegetOrders"
import { Order } from "@/models/Order"
import { OrderDetailsDialog } from "./OrderDetailsDialog"
import { ColumnDef } from "@tanstack/react-table"
import CustomDataTable from "@/components/CustomDataTable"

function AdminOrders() {
  const { orders, loading, error, getOrders } = useGetOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    getOrders()
  }, [])
  const columns: ColumnDef<Order>[] = [
    {
      id: "Sıra",
      header: "Sıra",
      cell: ({ row }) => row.index + 1
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
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
          >
            Sipariş Tarihi
            <ArrowUpDown />
          </Button>
        )
      },//new Date(order.orderDate).toLocaleString("tr-TR")
      cell: ({ row }) => <div className="lowercase">{new Date(row.getValue("orderDate")).toLocaleString("tr-TR")}</div>,
    },
    {
      accessorKey: "orderTotal",
      header: "Toplam",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue<number>("orderTotal").toFixed(2)} ₺</div>
      ),
    },
    {
      id: "İşlemler",
      header: "İşlemler",
      cell: ({ row }) => (
        <Button variant="outline" size="sm"
          onClick={() => { handleInfoClick(row.original.id) }}>
          <Info className="mr-2 h-4 w-4" />
          Detay
        </Button>
      )
    }

  ]
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
        <div className="flex items-center justify-center py-8 text-muted-foreground">Bu durumda sipariş bulunmuyor</div>
      )
    }

    return (
      <>
      {/*   <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sıra</TableHead>
              <TableHead>Masa Adı</TableHead>
              <TableHead>Oluşturma Tarihi</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{order.tableName}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleString("tr-TR")}</TableCell>
                <TableCell>{order.orderTotal.toFixed(2)} ₺</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleInfoClick(order.id)}>
                    <Info className="mr-2 h-4 w-4" />
                    Detay
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
        {/* <div className="p-1 w-full bg-black my-6"></div> */}
        <CustomDataTable  columns={columns} data={filteredOrders}/>
      </>
    )
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
          <CardDescription>Siparişleri durumlarına göre görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hazirlaniyor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hazirlaniyor">Hazırlanıyor ({hazirlaniyorOrders.length})</TabsTrigger>
              <TabsTrigger value="tamamlandi">Tamamlandı ({tamamlandiOrders.length})</TabsTrigger>
              <TabsTrigger value="iptal-edildi">İptal Edildi ({iptalEdildiOrders.length})</TabsTrigger>
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

      <OrderDetailsDialog orderId={selectedOrderId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

export default AdminOrders
