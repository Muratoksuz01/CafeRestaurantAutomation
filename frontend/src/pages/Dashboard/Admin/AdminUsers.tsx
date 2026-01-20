"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Search, Trash2, PencilLine, Check, X, MoreVertical, ArrowUpDown, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUsers } from "@/hooks/useGetUsers"
import { API_PATHS } from "@/lib/api"
import type { Users } from "@/models/User"
import EditDialog from "../components/EditDialog"
import CreateUserDialog from "./CreateUserDialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"



import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import CustomDataTable from "@/components/CustomDataTable"

function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad Soyad</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-[140px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-8 w-[60px]" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function AdminUsers() {

  const { users, getUsers, loading: userLoading } = useGetUsers()
  const [selectedUser, setSelectedUser] = useState<Users>({} as Users)
  const [searchQuery, setSearchQuery] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
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
          <Button
            variant={"ghost"}
            onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
          >
            Ad Soyad
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("firstName")} {row.getValue("lastName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
          >
            E-Posta
            <ArrowUpDown />
          </Button>
        )
      },//new Date(order.orderDate).toLocaleString("tr-TR")
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
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
            <Check className="text-green-600 w-5 h-5" />
          ) : (
            <X className="text-red-600 w-5 h-5" />
          )}
        </div>

      ),
    },
    {
      id: "İşlemler",
      header: ({ column }) => (< DataTableColumnHeader column={column} title="İşlemler" />),
      // header: "İşlemler",
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
            <DropdownMenuItem onClick={() => editUser(row.original)}>
              <PencilLine className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => deleteUser(String(row.original._id))}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

  ]


  useEffect(() => {
    getUsers()
  }, [])


  // Filter users based on search query
  const filteredUsers = users.filter((u) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      u.firstName?.toLowerCase().includes(searchLower) ||
      u.lastName?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      u.phoneNumber?.includes(searchQuery)
    )
  })



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

  const editUser = async (user: Users) => {
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcı İzin Yönetimi</h1>
        <p className="text-muted-foreground">Kullanıcı izinlerini görüntüleyin ve yönetin</p>
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
          <CardDescription>Kullanıcı izinlerini bilgilerini için butona tıklayın</CardDescription>
          <div className="flex items-center justify-between">
            <div className="relative w-82">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ad, soyad, e-posta veya telefon ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={userLoading}
                className="pl-9"
              />
            </div>

            <Button onClick={() => { setCreateDialog(true) }}>Yeni Eleman</Button>
          </div>

        </CardHeader>
        <CardContent>
          {userLoading ? (
            <TableSkeleton />
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">Kullanıcı bulunamadı</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Arama kriterlerinize uygun kullanıcı yok" : "Henüz aktif kullanıcı bulunmuyor"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
          
              <CustomDataTable columns={columns} data={filteredUsers} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Dialog */}
      {/* <PermissionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        userId={selectedUserId}
        onClose={handleCloseDialog}
        onSuccess={onSuccess}
      /> */}
      <EditDialog open={openEdit} setOpenEdit={setOpenEdit} user={selectedUser} onSuccess={onSuccess} />
      <CreateUserDialog open={createDialog} setOpen={setCreateDialog} onSuccess={onSuccess} />
    </div>
  )
}
