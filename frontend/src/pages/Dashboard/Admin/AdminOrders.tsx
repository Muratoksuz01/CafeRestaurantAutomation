import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, Info, Loader2 } from "lucide-react"
import { useGetOrders } from "@/hooks/usegetOrders"
import { Order } from "@/models/Order"
import { OrderDetailsDialog } from "./OrderDetailsDialog"
import { ColumnDef, Row } from "@tanstack/react-table"
import { DateRange } from 'react-day-picker'
import CustomDataTable from "@/components/CustomDataTable"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTablePagination } from "@/components/data-table-paginition"
import * as XLSX from "xlsx"
import DatePickerRangeDemo from "@/components/shadcn-studio/date-picker/date-picker-02"

function AdminOrders() {
  const { orders, loading, error, getOrders, getOrdersByDate } = useGetOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()


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
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
          >
            Masa İsmi
            <ArrowUpDown />
          </Button>
        )
      },
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
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Toplam" />),
      // header: "Toplam",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue<number>("orderTotal").toFixed(2)} ₺</div>
      ),
    },
    {
      id: "İşlemler",
      header: ({ column }) => (< DataTableColumnHeader column={column} title="İşlemler" />),
      // header: "İşlemler",
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



  function exportToExcel<T>(rows: T[], fileName = "data.xlsx") {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    XLSX.writeFile(wb, fileName)
  }

  const filterOrdersByStatus = (status: Order["status"]) => {
    return orders.filter((order) => order.status === status)
  }

  const renderOrdersTable = (filteredOrders: Order[]) => {
    

    return (
      <div>
        <div className="flex gap-3">

          <DatePickerRangeDemo
            onChange={setDateRange}
          />
          <Button
            className="mt-6"
            onClick={() => {
              if (!dateRange?.from || !dateRange?.to) return
              getOrdersByDate(dateRange)
            }}
          >
            Getir
          </Button>
        </div>
        <CustomDataTable
          columns={columns}
          data={filteredOrders}
          header={(table) => (
            <div className="mb-3 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  const rows = table
                    .getFilteredRowModel()
                    .rows
                    .map((r: Row<Order>, index: number) => ({
                      "Sıra": index + 1,
                      "Masa İsmi": r.original.tableName,
                      "Sipariş Tarihi": new Date(r.original.orderDate).toLocaleString("tr-TR"),
                      "Toplam": `${r.original.orderTotal.toFixed(2)} ₺`,
                      "Durum": r.original.status,
                      "Garson": r.original.waiterName,
                    }))

                  exportToExcel(rows, "orders.xlsx")
                }}
              >
                Excel Export
              </Button>
            </div>
          )}

        // footer={(table)=>(<DataTablePagination table={table} />)}
        />
      </div>
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
