import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Search, Trash2, PencilLine, Check, X, MoreVertical, User, Mail, Phone, Shield, Power, EyeOff, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUsers } from "@/hooks/useGetUsers"
import { API_PATHS } from "@/lib/api"
import { userCreateSchema, Users } from "@/models/User"
import EditDialog from "./components/EditDialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import CustomDataTable from "@/pages/Dashboard/components/CustomDataTable"
import { DataTableColumnHeader } from "../components/data-table-column-header"
import CustomAlertDialog from "../components/CustomAlertDialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import CustomDialog from "../components/CustomDialog"
import { Form } from "@/components/ui/form"
import CustomFormField from "../components/CustomFormField"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import { ApiResponse } from "@/lib/apiTypes"



export default function AdminUsers() {

  const { users, getUsers, loading: userLoading } = useGetUsers()
  const [selectedUser, setSelectedUser] = useState<Users | null>(null)
  const [editDialog, setEditDialog] = useState(false)
  const [createDialog, setCreateDialog] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
              openEditDialog(row.original)
            }
            }>
              <PencilLine className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                openDeleteDialog(row.original)
              }
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
  const openDeleteDialog = (t: any) => {

    console.log("dialog secimi:", t)
    setSelectedUser(t);
    setDeleteAlert(true);
  };
  const form = useForm<z.infer<typeof userCreateSchema>>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roleName: undefined,
      isActive: true,
      password: ""
    },
  })

  useEffect(() => {
    getUsers()
  }, [])

  const onSuccess = async () => {
    getUsers()
  }



  const openCreateDialog = () => {
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roleName: undefined,
      isActive: true,
      password: ""
    })
    setCreateDialog(true)
  }

  const openEditDialog = (user: Users) => {
    setSelectedUser(user)
    form.reset({
      firstName: user.firstName ?? "Bilimeyen",
      lastName: user.lastName ?? "Bilimeyen",
      email: user.email ?? "Bilimeyen",
      phoneNumber: user.phoneNumber ?? "",
      roleName: user.roleName ?? "Garson",
      isActive: user.isActive ?? false,
    })
    setEditDialog(true)
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


  const handleCreate = async (data: z.infer<typeof userCreateSchema>) => {
    console.log("[v0] Form submitted:", data)
    // TODO: Add API call here
    const res = await axiosInstance.post(API_PATHS.createUser, data)
    if (res.data.status) {
      onSuccess()
      toast.success("kullanıcı basarlılı olusturuldu", successStyle)
      setCreateDialog(false)
      return
    } else {
      toast.warning(res.data.message || "işlem hatası ", warningStyle)
    }
  }
 const handleDelete = async (user: Users | null) => {
  if (!user) return;

  try {
    const res = await axiosInstance.delete<ApiResponse>(
      API_PATHS.deleteUser(user._id.toString())
    );

    if (res.data.status) {
      onSuccess();
      toast.success("Kullanıcı başarıyla silindi", successStyle);
      setDeleteAlert(false);
      setSelectedUser(null);
     
    } else {
      toast.warning(res.data.message || "Silme işlemi başarısız", warningStyle);
    }
  } catch (error) {
    toast.error("Kullanıcı silinirken bir hata oluştu", warningStyle);
    console.error("Kullanıcı silme hatası:", error);
  }
};
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
                    <Button className="w-full md:w-auto" onClick={openCreateDialog}>
                      Yeni Eleman
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>



      <CustomDialog  // Create Dialog
        open={createDialog}
        onOpenChange={() => {
          setCreateDialog(false)
        }}
        title="Kullanıcıyı Olustur"
        // onConfirm={() => {handleSave(form.getValues())}}
        onConfirm={() => { handleCreate(form.getValues()) }}

        description={
          <Form  {...form}>
            <form onSubmit={form.handleSubmit(handleCreate,
              (errors) => {
                console.log("Form validation errors:", errors);

              }
            )} className="space-y-5">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <CustomFormField control={form.control} name="firstName" title="Ad">
                  {(field: any) => (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input {...field} placeholder="Ahmet" className="pl-9" />
                    </div>
                  )}
                </CustomFormField>

                <CustomFormField control={form.control} name="lastName" title="Soyad">
                  {(field: any) => <Input {...field} placeholder="Yılmaz" />}
                </CustomFormField>
              </div>

              {/* Email Field */}
              <CustomFormField control={form.control} name="email" title="E-posta">
                {(field: any) => (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} type="email" placeholder="ornek@email.com" className="pl-9" />
                  </div>
                )}
              </CustomFormField>

              {/* Phone Field with formatting */}
              <div className="grid grid-cols-2 gap-4">
                <CustomFormField control={form.control} name="phoneNumber" title="Telefon Numarası">
                  {(field: any) => (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="555 555 5555"
                        className="pl-9"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "") // sadece rakam
                          if (/^\d{0,10}$/.test(value)) {
                            field.onChange(value)
                          }
                        }}
                        maxLength={13}
                      />
                    </div>
                  )}
                </CustomFormField>

                <CustomFormField control={form.control} name={"password"} title="Sifre"  >
                  {(field: any) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-slate-50 border-slate-200  placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}
                </CustomFormField>
              </div>

              {/* Role Field */}
              <CustomFormField control={form.control} name="roleName" title="Rol">
                {(field: any) => (
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-9">
                        <SelectValue placeholder="Rol seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yonetici">Yönetici</SelectItem>
                        <SelectItem value="Garson">Garson</SelectItem>
                        <SelectItem value="Kasiyer">Kasiyer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CustomFormField>

              {/* Active Status Toggle */}
              <CustomFormField control={form.control} name="isActive" title="Kullanıcı Durumu">
                {(field: any) => (
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Power className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">{field.value ? "Aktif" : "Pasif"}</Label>
                        <p className="text-xs text-muted-foreground">
                          {field.value ? "Kullanıcı sisteme giriş yapabilir" : "Kullanıcı sisteme giriş yapamaz"}
                        </p>
                      </div>
                    </div>
                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </div>
                )}
              </CustomFormField>

              <DialogFooter className=" flex gap-2 ">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    İptal
                  </Button>
                </DialogClose>
                <Button type="submit">Kaydet</Button>
              </DialogFooter>
            </form>
          </Form>
        }
      />

      {selectedUser &&
        <EditDialog open={editDialog} setOpenEdit={setEditDialog} user={selectedUser} onSuccess={onSuccess} />
      }


      <CustomAlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}
        title={
          <p> <span className="text-destructive">{selectedUser?.firstName}</span> isimli kişiyi silmek istiyroumusunuz </p>
        }
        onConfirm={() => { handleDelete(selectedUser) }}
      />
    </div>
  )
}
