import { Button } from "@/components/ui/button";
import { ArrowUpDown, PencilLine, SearchIcon, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useGetTables } from "@/hooks/useGetTables";
import { AllTable } from "@/models/Tables";
import EditTable from "./editTable";
import CreateTable from "./CreateTable";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";
import { Column, ColumnDef, RowData } from "@tanstack/react-table";
import CustomDataTable from "@/components/CustomDataTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import Filter from "@/components/Filter";
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

  const openEdit = (t: AllTable) => {
    if (["dolu", "rezerve"].includes(t.status)) {
      toast.warning("Bu masa dolu olduğu için düzenleme yapamazsın.", warningStyle);
      return;
    }
    setSelected(t);
    setEditOpen(true);
  };
  const openDelete = (t: AllTable) => {
    if (["dolu", "rezerve"].includes(t.status)) {
      toast.warning("Dolu masa silinemez.", warningStyle);
      return;
    }
    setSelected(t);
    setDeleteOpen(true);
  };
  const deleteTable = async () => {
    if (!selected) return;
    const res = await axiosInstance.delete(API_PATHS.deleteTable(selected._id))
    if (res.data.success) {
      toast.success("silindi", successStyle)
      getTables()
    } else {
      toast.success("silinmedi", warningStyle)

    }
    setDeleteOpen(false);
  };
  const onSuccess = async () => {
    getTables();
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
            onClick={() => openEdit(row.original)}
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
            onClick={() => openDelete(row.original)}
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

  return (
    <div className="p-5">
      <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
        <CustomDataTable
          header={(table) => (
            <div className="flex justify-between mb-5 p-3 border-b">
              <h2 className="text-xl font-semibold">Masalar</h2>
              <div className="flex gap-3 items-center">

                <div className='w-44'>
                  <Filter column={table.getColumn('name')!} />
                </div>
                <div className='w-44'>
                  <Filter column={table.getColumn('status')!} />
                </div>

              </div>
              <Button onClick={() => setCreateOpen(true)}>Yeni Masa</Button>

            </div>
          )}
          data={tables} columns={column} />
      

      </div>

      {/* Dialoglar */}
      {editOpen && (
        <EditTable
          editOpen={editOpen}
          setEditOpen={setEditOpen}
          onEdit={onSuccess}
          selectetTable={selected}
        />
      )}

      <CreateTable
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        onCreate={onSuccess}

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
            <p>Masa: <b>{selected ? selected.name : ""}</b></p>
          </div>
        }
        onConfirm={deleteTable}
      />


    </div>

  );
}

export default TableList;



