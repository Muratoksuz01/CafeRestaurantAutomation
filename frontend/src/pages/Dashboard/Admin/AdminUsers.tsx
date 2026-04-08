import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Search, Trash2, PencilLine, Check, X, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUsers } from "@/hooks/useGetUsers"
import { API_PATHS } from "@/lib/api"
import type { Users } from "@/models/User"
import EditDialog from "./components/EditDialog"
import CreateUserDialog from "./components/CreateUserDialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import CustomDataTable from "@/pages/Dashboard/components/CustomDataTable"
import { DataTableColumnHeader } from "../components/data-table-column-header"
import CustomAlertDialog from "../components/CustomAlertDialog"



export default function AdminUsers() {

  const { users, getUsers, loading: userLoading } = useGetUsers()
  const [selectedUser, setSelectedUser] = useState<Users>({} as Users)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDel, setOpenDel] = useState(false)
  const [createDialog, setCreateDialog] = useState(false)
  const columns: ColumnDef<Users>[] = [
    {
      id: "Sıra",
      header: "Sıra",
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader title="Ad Soyad" column={column} />
        )
      },
      cell: ({ row }) => {
        // row.original üzerinden tüm nesneye erişiyoruz
        const user = row.original;
        return (
          <div className="capitalize">
            {user.firstName} {user.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader title="E Posta" column={column} />

        )
      },//new Date(order.orderDate).toLocaleString("tr-TR")
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: "Telefon Numarası",
      cell: ({ row }) => (
        <div>{row.getValue("phoneNumber")}</div>
      ),
    },
    {
      accessorKey: "roleName",
      header: "Rol",
      cell: ({ row }) => (
        <div>{badgePrinter(row.original.roleName)}</div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Aktif",
      cell: ({ row }) => (
        <div>
          {row.original.isActive ? (
            <Check className="text-green-600 w-4 h-4" />
          ) : (
            <X className="text-red-600 w-4 h-4" />
          )}
        </div>

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
              setSelectedUser(row.original)
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
                setSelectedUser(row.original)
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


  useEffect(() => {
    getUsers()
  }, [])

  const onSuccess = async () => {
    getUsers()
  }

  const deleteUser = async (id: string) => {
    try {
      await axiosInstance.delete(API_PATHS.deleteUser(id))
      getUsers()
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
    }
  }

  const editUser = (user: Users) => {
    setSelectedUser(user)
    setOpenEdit(true)
  }
  const badgePrinter = (roleName: "Asci" | "Yonetici" | "Garson" | "Kasiyer") => {
    switch (roleName) {
      case "Yonetici":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            Yönetici
          </Badge>
        )

      case "Asci":
        return (
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
            Aşçı
          </Badge>
        )

      case "Garson":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            Garson
          </Badge>
        )

      case "Kasiyer":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            Kasiyer
          </Badge>
        )

      default:
        return <Badge variant="secondary">{roleName}</Badge>
    }
  }
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 overflow-x-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcı İzin Yönetimi</h1>
        <p className="text-foreground text-xl">Kullanıcı izinlerini görüntüleyin ve yönetin</p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
        </CardHeader>
        <CardContent>
          {userLoading ? (
            <>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-4 w-[140px]" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Aktif sistem kullanıcıları</p>
            </>
          )}
        </CardContent>
      </Card>
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Kullanıcılar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="rounded-md border overflow-x-auto">
              <CustomDataTable
                columns={columns} data={users}
                header={(table) => (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 p-3 border-b gap-2">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Ad, soyad, e-posta veya telefon ile ara..."
                        value={table.getState().globalFilter ?? ""}
                        onChange={(e) => table.setGlobalFilter(e.target.value)}
                        disabled={userLoading}
                        className="pl-9 w-full"
                      />
                    </div>
                    <Button className="w-full md:w-auto" onClick={() => setCreateDialog(true)}>
                      Yeni Eleman
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>



      <EditDialog open={openEdit} setOpenEdit={setOpenEdit} user={selectedUser} onSuccess={onSuccess} />
      <CreateUserDialog open={createDialog} setOpen={setCreateDialog} onSuccess={onSuccess} />
      <CustomAlertDialog open={openDel} onOpenChange={() => {
        setOpenDel(false)
        setSelectedUser({} as Users)
      }}
        title={
          <p> <span className="text-destructive">{selectedUser.firstName}</span> isimli kişiyi silmek istiyroumusunuz </p>
        }
        onConfirm={() => {
          deleteUser(selectedUser._id.toString())
          setSelectedUser({} as Users)
          setOpenDel(false)
        }}
      />
    </div>
  )
}
