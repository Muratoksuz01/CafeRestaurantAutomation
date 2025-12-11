import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useGetTables } from "@/hooks/useGetTables";
import { AllTable } from "@/models/Tables";
import EditTable from "./editTable";
import CreateTable from "./CreateTable";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";


function UserList() {
  // const [tables, setTables] = useState<TableType[]>(initialTables);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<AllTable | null>(null);
  const { tables, getTables } = useGetTables()
  useEffect(() => {
    getTables()
  }, [])

  const openEdit = (t: AllTable) => {
    if (t.status === "dolu") {
      toast.warning("Bu masa dolu olduğu için düzenleme yapamazsın.", warningStyle);
      return;
    }
    setSelected(t);
    setEditOpen(true);
  };
  const saveEdit = () => {
    // if (!selected) return;
    getTables()
    // setEditOpen(false);
  };

  const openDelete = (t: AllTable) => {
    if (t.status === "dolu") {
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
  const createTable = async () => {
    getTables();
  };

  return (
    <div className="p-5">
  <div className="flex justify-between mb-5 pb-3 border-b">
    <h2 className="text-xl font-semibold">Masalar</h2>
    <Button onClick={() => setCreateOpen(true)}>Yeni Masa</Button>
  </div>

  <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="py-4 text-gray-700 font-semibold">Sıra</TableHead>
          <TableHead className="py-4 text-gray-700 font-semibold">Masa Adı</TableHead>
          <TableHead className="py-4 text-gray-700 font-semibold">Durum</TableHead>
          <TableHead className="py-4 text-right text-gray-700 font-semibold">İşlemler</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tables.map((t, index) => (
          <TableRow
            key={t._id}
            className="
              transition-all 
              hover:bg-gray-100/60
              border-b
            "
          >
            <TableCell className="font-medium py-4">{index + 1}</TableCell>

            <TableCell className="font-medium py-4">
              {t.name}
            </TableCell>

            <TableCell className="py-4">
              {t.status === "dolu" ? (
                <span
                  className="
                    inline-flex items-center 
                    bg-red-600 text-white
                    text-xs font-semibold 
                    px-3 py-1.5
                    rounded-full shadow-sm
                  "
                >
                  Dolu
                </span>
              ) : (
                <span
                  className="
                    inline-flex items-center 
                    text-green-700 bg-green-100
                    text-xs font-semibold 
                    px-3 py-1.5
                    rounded-full
                    border border-green-300
                  "
                >
                  Boş
                </span>
              )}
            </TableCell>

            <TableCell className="text-right space-x-2 py-4">
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg"
                onClick={() => openEdit(t)}
              >
                <Pencil size={16} />
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="rounded-lg"
                onClick={() => openDelete(t)}
              >
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>

  {/* Dialoglar */}
  {editOpen && (
    <EditTable
      editOpen={editOpen}
      setEditOpen={setEditOpen}
      onEdit={saveEdit}
      selectetTable={selected}
    />
  )}

  <CreateTable
    createOpen={createOpen}
    setCreateOpen={setCreateOpen}
    onCreate={createTable}
  />

  <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Bu masayı silmek istiyor musun?</AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>İptal</AlertDialogCancel>
        <AlertDialogAction onClick={deleteTable}>Sil</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>

  );
}

export default UserList;
