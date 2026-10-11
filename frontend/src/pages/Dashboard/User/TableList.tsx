import { Button } from "@/components/ui/button";
import { ArrowUpDown, PencilLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useGetTables } from "@/hooks/useGetTables";
import { AllTable, tableCreateEditSchema } from "@/models/Tables";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { ColumnDef, RowData } from "@tanstack/react-table";
import CustomDataTable from "@/pages/Dashboard/components/CustomDataTable";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CustomAlertDialog from "@/pages/Dashboard/components/CustomAlertDialog";
import Filter from "@/pages/Dashboard/components/Filter";
import TableFormDialog from "./TableFormDialog";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select'
  }
}
function TableList() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<AllTable | null>(null);
  const { tables, getTables } = useGetTables()
  useEffect(() => {
    getTables()
  }, [])

  const openEditDialog = (t: AllTable) => {
    if (["dolu", "rezerve"].includes(t.status)) {
      toast.warning("Bu masa dolu olduğu için düzenleme yapamazsın.", warningStyle);
      return;
    }
    setSelected(t);
    setEditOpen(true);
  };
  const openDeleteDialog = (t: AllTable) => {
    if (["dolu", "rezerve"].includes(t.status)) {
      toast.warning("Dolu/Rezerve masa silinemez.", warningStyle);
      return;
    }
    console.log("dialog secimi:", t)
    setSelected(t);
    setDeleteOpen(true);
  };
  const deleteTable = async (table: AllTable | null) => {
    console.log("delete:", table)
    if (!table) return;

    const res = await axiosInstance.delete(API_PATHS.deleteTable(table._id));

    if (res.data.status) {
      toast.success("silindi", successStyle);
      await getTables();
      setSelected(null);
    } else {
      toast.success("silinmedi", warningStyle);
    }

    setDeleteOpen(false);
  };
  const onSuccess = async () => {
    await getTables();
  };

  const column: ColumnDef<AllTable>[] = [
    {
      id: "Sıra",
      header: "Sıra",
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
          >
            Masa Adı
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Masa Adı
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const styles = {
          bos: 'bg-green-600/10 text-green-600',
          dolu: 'bg-destructive/10 text-destructive',
          rezerve: 'bg-amber-600/10 text-amber-600',
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
    }
    ,
    {
      header: "İşlemler",
      // header: "İşlemler",
      cell: ({ row }) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="
      flex items-center gap-1
      transition-all
      group-hover:opacity-100
    "
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={() => openEditDialog(row.original)}
            className="
        h-8 w-8 rounded-md
        hover:bg-primary/10 hover:text-primary
        dark:hover:bg-primary/20 dark:hover:text-primary
        focus-visible:ring-2
        focus-visible:ring-primary/40
      "
          >
            <PencilLine className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => openDeleteDialog(row.original)}
            className="
        h-8 w-8 rounded-md
        text-destructive
        hover:bg-destructive/10 hover:text-destructive
        dark:hover:bg-destructive/20 dark:hover:text-destructive
        focus-visible:ring-2
        focus-visible:ring-destructive/40
      "
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )



    }
  ]


 /*  const handleCreate = async (data: any) => {
    try {
      console.log(data)
      const res = await axiosInstance.post(API_PATHS.createTable, data)

      // Backend'den dönen başarı flag'lerini kontrol et (status veya success)
      if (res.data.status) {
        toast.success("Masa eklendi", successStyle)
        form.reset()
        await onSuccess()
        setCreateOpen(false)
      }
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu")
    }
  }
  const handleEdit = async (data: any) => {
    try {
      console.log(data)
      const res = await axiosInstance.put(API_PATHS.editTable(selected!._id), data)

      // Backend'den dönen başarı flag'lerini kontrol et (status veya success)
      if (res.data.status) {
        toast.success("Masa güncellendi", successStyle)
        form.reset()
        await onSuccess()
        setEditOpen(false)
      }
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu")
    }
  } */

  const form = useForm({
    resolver: zodResolver(tableCreateEditSchema),
    defaultValues: {
      name: "",
    },
  })
  useEffect(() => {
    if (selected && editOpen) {
      form.reset({
        name: selected.name || ""
      });
    }
    
  }, [ editOpen]);
  return (
  <div className=" p-2">
    <div className="rounded-xl  bg-background shadow-sm overflow-hidden">
      <CustomDataTable
        header={(table) => (
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-5 p-3 border-b">
            
            <h2 className="text-lg sm:text-xl font-semibold">
              Masalar
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-44">
                <Filter column={table.getColumn('name')!} />
              </div>
              <div className="w-full sm:w-44">
                <Filter column={table.getColumn('status')!} />
              </div>
            </div>

            <Button
              onClick={() => setCreateOpen(true)}
              className="w-full sm:w-auto"
            >
              Yeni Masa
            </Button>

          </div>
        )}
        data={tables}
        columns={column}
      />
    </div>

    <TableFormDialog
      open={createOpen}
      onOpenChange={setCreateOpen}
      onSuccess={onSuccess}
    />

    <TableFormDialog
      open={editOpen}
      onOpenChange={setEditOpen}
      table={selected}
      onSuccess={onSuccess}
    />

    <CustomAlertDialog
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      title={
        <span>
          Bu masayı <strong className="text-destructive">silmek</strong> istiyor musun?
        </span>
      }
      description={
        <div className="text-sm text-muted-foreground">
          <p>Bu işlem geri alınamaz.</p>
          <p>Masa: <b>{selected ? selected.name : "veri gelmedi"}</b></p>
        </div>
      }
      onConfirm={() => deleteTable(selected)}
    />
  </div>
);
}

export default TableList;



