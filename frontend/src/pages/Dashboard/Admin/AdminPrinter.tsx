import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Search, Trash2, PencilLine, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { API_PATHS } from "@/lib/api"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import CustomDataTable from "@/pages/Dashboard/components/CustomDataTable"
import { DataTableColumnHeader } from "../components/data-table-column-header"
import CustomAlertDialog from "../components/CustomAlertDialog"
import { useGetPrinter } from "@/hooks/useGetPrinter"
import { Printers } from "@/models/Food"
import EditPrinter from "./components/EditPrinter"
import CreatePrinter from "./components/CreatePrinter"




function AdminPrinter() {
     const [selectedPrinter, setSelectedPrinter] = useState<Printers>({} as Printers)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDel, setOpenDel] = useState(false)
  const [createDialog, setCreateDialog] = useState(false)
useEffect(()=>{
    getPrinters()
},[])
  const onSuccess = async () => {
     getPrinters()
  }
  const deletePrinter = async (id: string) => {
    try {
      await axiosInstance.delete(API_PATHS.deletePrinter(id))
      getPrinters()
    } catch (error) {
      console.error("[v0] Error deleting printer:", error)
    }
  }
const {printers,getPrinters,loading:printerLoading} =useGetPrinter()
 const columns: ColumnDef<Printers>[] = [
    {
      id: "Sıra",
      header: "Sıra",
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader title="Yazıcı İsmi" column={column} />
        )
      },
      cell: ({ row }) => {
        // row.original üzerinden tüm nesneye erişiyoruz
        const printer = row.original;
        return (
          <div className="capitalize">
            {printer.name} 
          </div>
        );
      },
    },
    {
      accessorKey: "printerIp",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader title="Yazıcı Ip adresi " column={column} />

        )
      },//new Date(order.orderDate).toLocaleString("tr-TR")
      cell: ({ row }) => <div>{row.getValue("printerIp")}</div>,
    },
    {
      accessorKey: "printerType",
      header: "Yazıcı Tipi",
      cell: ({ row }) => (
        <div>{row.getValue("printerType")}</div>
      ),
    },
    
    
    {
      id: "İşlemler",
      header: "İşlemler",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setSelectedPrinter(row.original)
              setOpenEdit(true)
            }
              // editUser(row.original)
            }>
              <PencilLine className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                setSelectedPrinter(row.original)
                setOpenDel(true)
              }
                // deleteUser(String(row.original._id))
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu >
      )
    }

  ]
 return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 overflow-x-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Yazıcı Yönetimi</h1>
        <p className="text-foreground text-xl">Yazıcıları görüntüleyin ve yönetin</p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Yazıcı</CardTitle>
        </CardHeader>
        <CardContent>
          {printerLoading ? (
            <>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-4 w-[140px]" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{printers.length}</div>
              <p className="text-xs text-muted-foreground">Sistemde Şuan Olan Yazıcı Sayısı </p>
            </>
          )}
        </CardContent>
      </Card>
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Yazıcılar </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="rounded-md border overflow-x-auto">
              <CustomDataTable
              emptyRowText="herhangi bir YAzıcı yok"
                columns={columns} data={printers}
                header={(table) => (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 p-3 border-b gap-2">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Yazıcı Ara..."
                        value={table.getState().globalFilter ?? ""}
                        onChange={(e) => table.setGlobalFilter(e.target.value)}
                        disabled={printerLoading}
                        className="pl-9 w-full"
                      />
                    </div>
                    <Button className="w-full md:w-auto" onClick={() => setCreateDialog(true)}>
                      Yeni Yazıcı
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>



      <EditPrinter open={openEdit} setOpenEdit={setOpenEdit} printer={selectedPrinter} onSuccess={onSuccess} />
      <CreatePrinter open={createDialog} setOpen={setCreateDialog} onSuccess={onSuccess} />
      <CustomAlertDialog open={openDel} onOpenChange={() => {
        setOpenDel(false)
        setSelectedPrinter({} as Printers)
      }}
        title={
          <p> <span className="text-destructive">{selectedPrinter.name}</span> isimli Yazıcıyı silmek istiyormusunuz  </p>
        }
        onConfirm={() => {
          deletePrinter(selectedPrinter._id.toString())
          setSelectedPrinter({} as Printers)
          setOpenDel(false)
        }}
      />
    </div>
  )
}

export default AdminPrinter