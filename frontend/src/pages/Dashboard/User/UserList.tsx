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
import { warningStyle } from "@/lib/toastStyle";
import { useGetTables } from "@/hooks/useGetTables";
import { MyTable } from "@/models/Tables";
import EditTable from "./editTable";
import CreateTable from "./CreateTable";

// interface TableType {
//   id: number;
//   name: string;
//   status: "dolu" | "boş";
// }

// const initialTables: Table[] = [
//   { id: 1, name: "Masa 1", status: "boş" },
//   { id: 2, name: "Masa 2", status: "dolu" },
//   { id: 3, name: "Masa 3", status: "boş" },
// ];

function UserList() {
 // const [tables, setTables] = useState<TableType[]>(initialTables);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<MyTable | null>(null);
const {tables,getTables} =useGetTables()
  useEffect(()=>{
    getTables()
  },[])

  const openEdit = (t:  MyTable) => {
    if (t.status === "dolu") {
      toast.warning("Bu masa dolu olduğu için düzenleme yapamazsın.",warningStyle);
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

  const openDelete = (t: MyTable) => {
    if (t.status === "dolu") {
      toast.warning("Dolu masa silinemez.",warningStyle);
      return;
    }
    setSelected(t);
    setDeleteOpen(true);
  };
  const deleteTable = () => {
    if (!selected) return;
    // setTables(prev => prev.filter(t => t.id !== selected.id));
    getTables()
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
     <EditTable editOpen={editOpen} setEditOpen={setEditOpen} onEdit={saveEdit} selectetTable={selected} />
{/* CREATE DILALOG */}
<CreateTable createOpen={createOpen}setCreateOpen={setCreateOpen} onCreate={createTable}/>
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
