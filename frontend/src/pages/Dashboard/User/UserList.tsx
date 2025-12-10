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
      <Button onClick={() => setCreateOpen(true)}>Yeni Masa</Button>

      <h2 className="text-xl font-semibold mb-4">Masalar</h2>

      {/* TABLO */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Masa Adı</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tables.map(t => (
            <TableRow key={t._id}>
              <TableCell>{t._id}</TableCell>
              <TableCell>{t.name}</TableCell>
              <TableCell className={t.status === "dolu" ? "text-red-600" : "text-green-600"}>
                {t.status}
              </TableCell>

              <TableCell className="text-right space-x-2">

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(t)}
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDelete(t)}
                >
                  <Trash2 size={16} />
                </Button>

              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* EDIT DIALOG */}
      {editOpen && <EditTable editOpen={editOpen} setEditOpen={setEditOpen} onEdit={saveEdit} selectetTable={selected} />
      }
      {/* CREATE DILALOG */}
      <CreateTable createOpen={createOpen} setCreateOpen={setCreateOpen} onCreate={createTable} />
      {/* DELETE ALERT DIALOG */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bu masayı silmek istiyor musun?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTable}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default UserList;
