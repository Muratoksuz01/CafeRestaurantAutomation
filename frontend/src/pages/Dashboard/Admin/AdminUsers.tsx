"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Search, Trash2, PencilLine } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUsers } from "@/hooks/useGetUsers"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { PermissionDialog } from "@/components/permission-dialog"
import { API_PATHS } from "@/lib/api"
import type { Users } from "@/models/User"
import EditDialog from "../components/EditDialog"

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
  const { user: currentUser } = useSelector((state: RootState) => state.auth)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<Users>({} as Users)
  const [searchQuery, setSearchQuery] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  useEffect(() => {
    getUsers()
  }, [])

  // Filter only active users (excluding current user)
  const activeUsers = users.filter((u) => u.isActive === true && u._id?.toString() !== currentUser?.id?.toString())

  // Filter users based on search query
  const filteredUsers = activeUsers.filter((u) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      u.firstName?.toLowerCase().includes(searchLower) ||
      u.lastName?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      u.phoneNumber?.includes(searchQuery)
    )
  })

  const handleUserClick = (id: string) => {
    setSelectedUserId(id)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setSelectedUserId("")
    setOpenDialog(false)
  }

  const onSuccess = async () => {
    getUsers()
    setSelectedUserId("")
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
              <div className="text-2xl font-bold">{activeUsers.length}</div>
              <p className="text-xs text-muted-foreground">Aktif sistem kullanıcıları</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Kullanıcılar</CardTitle>
          <CardDescription>Kullanıcı izinlerini düzenlemek için satıra tıklayın</CardDescription>

          {/* Search Input */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ad, soyad, e-posta veya telefon ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={userLoading}
            />
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
                  {filteredUsers.map((u) => (
                    <TableRow key={u._id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-muted-foreground">{u.phoneNumber}</TableCell>
                      <TableCell>
                        {badgePrinter(u.roleName)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUserClick(String(u._id))
                            }}
                          >
                            İzinleri Düzenle
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                            onClick={() => deleteUser(String(u._id))}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Sil</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-3 gap-2 border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-colors bg-transparent"
                            onClick={() => editUser(u)}
                          >
                            <PencilLine className="h-4 w-4" />
                            <span className="hidden sm:inline">Düzenle</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Dialog */}
      <PermissionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        userId={selectedUserId}
        onClose={handleCloseDialog}
        onSuccess={onSuccess}
      />


      <EditDialog open={openEdit} setOpenEdit={setOpenEdit} user={selectedUser} onSuccess={onSuccess} />

    </div>
  )
}
