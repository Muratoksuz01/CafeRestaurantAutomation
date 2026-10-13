import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Search, Trash2, PencilLine, MoreVertical, Shield, User } from "lucide-react"
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
import { printerCreateEditSchema, Printers } from "@/models/Food"
import { Form } from "@/components/ui/form"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import CustomFormField from "../components/CustomFormField"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomDialog from "../components/CustomDialog"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"




function AdminPrinter() {
  const [selectedPrinter, setSelectedPrinter] = useState<Printers>({} as Printers)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDel, setOpenDel] = useState(false)
  const [createDialog, setCreateDialog] = useState(false)
  const form = useForm<z.infer<typeof printerCreateEditSchema>>({
    resolver: zodResolver(printerCreateEditSchema),
    defaultValues: {
      name: "",
      printerIp: "",
      printerType:""

    },
  })
  useEffect(() => {
    getPrinters()
  }, [])
  const onSuccess = async () => {
    getPrinters()
  }
  const handleEditDialog = (printer: Printers) => {
    setSelectedPrinter(printer)
    form.reset({
      name: printer.name,
      printerIp: printer.printerIp,
      printerType:printer.printerType
    })
    setOpenEdit(true)
  }
  const handleDeleteDialog = (printer:Printers) => {
    setSelectedPrinter(printer)
    setOpenDel(true)

  }
  const handleCreateDialog= () => {
    form.reset({
       name: "",
      printerIp: "",
      printerType:""
    })
    setCreateDialog(true)
  }
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(API_PATHS.deletePrinter(id))
      onSuccess()
    } catch (error) {
      console.error("[v0] Error deleting printer:", error)
    }
  }
  const handleCreate = async (data: z.infer<typeof printerCreateEditSchema>) => {
    console.log("[v0] Form submitted:", data)
    // TODO: Add API call here
    const res = await axiosInstance.post(API_PATHS.createPrinter, data)
    if (res.data.status) {
      onSuccess()
      toast.success("kullanıcı basarlılı olusturuldu", successStyle)
      setCreateDialog(false)
      return
    } else {
      toast.warning(res.data.message || "işlem hatası ", warningStyle)
    }
  }
  const handleEdit = async (data: z.infer<typeof printerCreateEditSchema>) => {
    console.log("[v0] Form submitted:", data)
    // TODO: Add API call here
    const res = await axiosInstance.put(API_PATHS.updatePrinter(String(selectedPrinter._id)), data)
    if (res.data.status) {
      onSuccess()
      toast.success("kullanıcı basarlılı guncellendi", successStyle)
      setOpenEdit(false)
      return
    }
    else {
      toast.warning(res.data.message || "işlem hatası ", warningStyle)
    }
  }
  const { printers, getPrinters, loading: printerLoading } = useGetPrinter()
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
              handleEditDialog(row.original)
            }
            }>
              <PencilLine className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                handleDeleteDialog(row.original)
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
                    <Button className="w-full md:w-auto" onClick={handleCreateDialog}>
                      Yeni Yazıcı
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomDialog   // create Dialog
        open={createDialog}
        onOpenChange={() => {
          form.reset()
          setCreateDialog(false)
        }}
        title="Yazıcı olusvfvdtur"
        //  onConfirm={() => { handleSave(form.getValues()) }}
        description={
          <Form  {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-5">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <CustomFormField control={form.control} name="name" title="Yazıcı ismi">
                  {(field: any) => (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input {...field} className="pl-9" placeholder="Kasiyer 1 yazıcı" />
                    </div>
                  )}
                </CustomFormField>

                <CustomFormField control={form.control} name="printerIp" title="Yazıcı Ip">
                  {(field: any) => (
                    <Input
                      {...field}
                      placeholder="192.168.1.100"
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9.]/g, ""); // Sadece rakam ve nokta

                        const blocks = value.split(".");

                        // 1. En fazla 4 blok olabilir (1.2.3.4 gibi)
                        if (blocks.length > 4) return;

                        // 2. Her blok 0-255 arası olmalı ve en fazla 3 haneli olmalı
                        const isValid = blocks.every((block) => {
                          if (block === "") return true; // Yazma anında boş olabilir
                          const num = parseInt(block, 10);
                          return num >= 0 && num <= 255 && block.length <= 3;
                        });

                        if (isValid) {
                          field.onChange(value);
                        }
                      }}
                    />
                  )}
                </CustomFormField>
              </div>



              <CustomFormField control={form.control} name="printerType" title="Yazıcı Tipi">
                {(field: any) => (
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-9">
                        <SelectValue placeholder="Tip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="58">58</SelectItem>
                        <SelectItem value="80">80</SelectItem>
                      </SelectContent>
                    </Select>
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
      <CustomDialog  // edit dialog
        open={openEdit}
        onOpenChange={() => {
          form.reset()
          setOpenEdit(false)
        }}
        title="Yazıcıyı Düzenle"
        // onConfirm={() => {handleSave(form.getValues())}}
        description={
          <Form  {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-5">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <CustomFormField control={form.control} name="name" title="Yazıcı ismi">
                  {(field: any) => (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input {...field} className="pl-9" />
                    </div>
                  )}
                </CustomFormField>

                <CustomFormField control={form.control} name="printerIp" title="Yazıcı Ip">
                  {(field: any) => <Input {...field} />}
                </CustomFormField>
              </div>



              {/* Role Field */}
              <CustomFormField control={form.control} name="printerType" title="Yazıcı Tipi">
                {(field: any) => (
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-9">
                        <SelectValue placeholder="Tip seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="58">58</SelectItem>
                        <SelectItem value="80">80</SelectItem>
                      </SelectContent>
                    </Select>
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
      <CustomAlertDialog open={openDel} onOpenChange={() => {
        setOpenDel(false)
        setSelectedPrinter({} as Printers)
      }}
        title={
          <p> <span className="text-destructive">{selectedPrinter.name}</span> isimli Yazıcıyı silmek istiyormusunuz  </p>
        }
        onConfirm={() => {
          handleDelete(selectedPrinter._id.toString())
          setSelectedPrinter({} as Printers)
          setOpenDel(false)
        }}
      />
    </div>
  )
}

export default AdminPrinter