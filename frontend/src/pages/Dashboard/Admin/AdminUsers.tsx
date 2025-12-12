"use client"

import { useEffect } from "react"
import { API_PATHS } from "@/lib/api"
import axiosInstance from "@/lib/axiosInstance"
import { Trash2, Check, X, UserCheck, UserX, Users, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetUsers } from "@/hooks/useGetUsers"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export default function AdminUsers() {
  const { users, getUsers } = useGetUsers()
    const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    getUsers()
  }, [])

  const pendingUsers = users.filter((u) => u.isActive === null)
  const rejectedUsers = users.filter((u) => u.isActive === false)
const activeUsers = users.filter((u) =>u.isActive === true && u._id.toString() !== user?.id.toString()
);
  const approveUser = async (id: string) => {
    try {
      await axiosInstance.put(API_PATHS.giveApproach(id))
      getUsers()
    } catch (error) {
      console.error("[v0] Error approving user:", error)
    }
  }

  const rejectUser = async (id: string) => {
    try {
      await axiosInstance.put(API_PATHS.giveReject(id))
      getUsers()
    } catch (error) {
      console.error("[v0] Error rejecting user:", error)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await axiosInstance.delete(API_PATHS.deleteUser(id))
      getUsers()
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">Kullanıcı onaylarını yönetin ve sistem erişimlerini kontrol edin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onay Bekleyen</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
            <p className="text-xs text-muted-foreground">İşlem bekliyor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kullanıcılar</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.length}</div>
            <p className="text-xs text-muted-foreground">Sisteme erişebiliyor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reddedilen</CardTitle>
            <UserX className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedUsers.length}</div>
            <p className="text-xs text-muted-foreground">Erişim engellendi</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different user states */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Bekleyen</span>
            {pendingUsers.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {pendingUsers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Aktif</span>
            {activeUsers.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {activeUsers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <UserX className="h-4 w-4" />
            <span className="hidden sm:inline">Reddedilen</span>
             {rejectedUsers.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {rejectedUsers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Pending Users Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Onay Bekleyen Kullanıcılar</CardTitle>
              <CardDescription>Bu kullanıcılar sisteme kaydoldu ve onayınızı bekliyor</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Bekleyen kullanıcı yok</p>
                  <p className="text-sm text-muted-foreground">Tüm kayıtlar işlenmiş görünüyor</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ad</TableHead>
                        <TableHead>Soyad</TableHead>
                        <TableHead>E-posta</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">{u.firstName}</TableCell>
                          <TableCell>{u.lastName}</TableCell>
                          <TableCell className="text-muted-foreground">{u.email}</TableCell>
                          <TableCell className="text-muted-foreground">{u.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{u.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-2 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 bg-transparent"
                                onClick={() => approveUser(String(u._id))}
                              >
                                <Check className="h-4 w-4" />
                                <span className="hidden sm:inline">Onayla</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-2 border-rose-500/50 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 bg-transparent"
                                onClick={() => rejectUser(String(u._id))}
                              >
                                <X className="h-4 w-4" />
                                <span className="hidden sm:inline">Reddet</span>
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
        </TabsContent>

        {/* Active Users Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Aktif Kullanıcılar</CardTitle>
              <CardDescription>Sisteme erişim yetkisi olan onaylanmış kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              {activeUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Aktif kullanıcı yok</p>
                  <p className="text-sm text-muted-foreground">Henüz onaylanmış kullanıcı bulunmuyor</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ad</TableHead>
                        <TableHead>Soyad</TableHead>
                        <TableHead>E-posta</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeUsers.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">{u.firstName}</TableCell>
                          <TableCell>{u.lastName}</TableCell>
                          <TableCell className="text-muted-foreground">{u.email}</TableCell>
                          <TableCell className="text-muted-foreground">{u.phoneNumber}</TableCell>
                          <TableCell>
                            {u.role === "admin" ? (
                              <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary">User</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                              onClick={() => deleteUser(String(u._id))}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Sil</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Users Tab */}
        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Reddedilen Kullanıcılar</CardTitle>
              <CardDescription>Erişim talebi reddedilmiş veya engellenmiş kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              {rejectedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Reddedilen kullanıcı yok</p>
                  <p className="text-sm text-muted-foreground">Henüz reddedilmiş kayıt bulunmuyor</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ad</TableHead>
                        <TableHead>Soyad</TableHead>
                        <TableHead>E-posta</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedUsers.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">{u.firstName}</TableCell>
                          <TableCell>{u.lastName}</TableCell>
                          <TableCell className="text-muted-foreground">{u.email}</TableCell>
                          <TableCell className="text-muted-foreground">{u.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{u.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-2 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 bg-transparent"
                                onClick={() => approveUser(String(u._id))}
                              >
                                <Check className="h-4 w-4" />
                                <span className="hidden sm:inline">Onayla</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                                onClick={() => deleteUser(String(u._id))}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Sil</span>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
