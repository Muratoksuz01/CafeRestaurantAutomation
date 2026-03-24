import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Info, Loader2 } from "lucide-react"
import { useGetOrders } from "@/hooks/usegetOrders"
import { Order } from "@/models/Order"
import { OrderDetailsDialog } from "./OrderDetailsDialog"
import { ColumnDef, Row, RowData } from "@tanstack/react-table"
import { DateRange } from 'react-day-picker'
import CustomDataTable from "@/components/CustomDataTable"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { DataTablePagination } from "@/components/data-table-paginition"
import DatePickerRangeDemo from "@/components/shadcn-studio/date-picker/date-picker-02"
import { Badge } from "@/components/ui/badge"
import { cn, exportToExcel } from "@/lib/utils"
import Filter from "@/components/Filter"
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
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
      accessorKey: "status",//    status: "hazirlaniyor" | "tamamlandi" | "iptal edildi";

      header: "Sipariş Durumu",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const styles = {
          tamamlandi: 'bg-green-600/10 text-green-600',
          "iptal edildi": 'bg-destructive/10 text-destructive',
          hazirlaniyor: 'bg-amber-600/10 text-amber-600',
        }[status]

        return (
          <div className="py-4">
            <Badge
              className={cn(
                'border-none capitalize text-md px-4 py-2',
                styles
              )}
            >
              {status}
            </Badge>
          </div>
        )
      },
      meta: {
        filterVariant: 'select'
      }
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


  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sipariş Yönetimi</CardTitle>
          <CardDescription>Siparişleri durumlarına göre görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>

          <CustomDataTable
            columns={columns}
            data={orders}
            header={(table) => (
              <div className="mb-3 flex justify-between">
                 <div className='w-44'>
                  <Filter column={table.getColumn('tableName')!} />
                </div>
                {/* tarih secici */}
                <div className="flex gap-3">
                  <DatePickerRangeDemo onChange={setDateRange} />
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
                
                <div className='w-44'>
                  <Filter column={table.getColumn('status')!} />
                </div>
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

            footer={(table) => (<div className="p-3">
              <DataTablePagination table={table} />
            </div>  )}
          />
        </CardContent>
      </Card>

      <OrderDetailsDialog orderId={selectedOrderId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

export default AdminOrders
