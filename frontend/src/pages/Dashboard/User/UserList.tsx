import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useGetTables } from "@/hooks/useGetTables";
import { AllTable } from "@/models/Tables";
import EditTable from "./editTable";
import CreateTable from "./CreateTable";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function UserList() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<AllTable | null>(null);
  const { tables, getTables } = useGetTables()
  useEffect(() => {
   
    getTables()
  }, [])

  const openEdit = (t: AllTable) => {
    if (["dolu","rezerve"].includes(t.status)) {
      toast.warning("Bu masa dolu olduğu için düzenleme yapamazsın.", warningStyle);
      return;
    }
    setSelected(t);
    setEditOpen(true);
  };
  const openDelete = (t: AllTable) => {
    if (["dolu","rezerve"].includes(t.status)) {
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "dolu" | "bos" | "rezerve">("all");
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchSearch = t.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all"
          ? true
          : t.status === statusFilter; // bos | dolu | rezerve

      return matchSearch && matchStatus;
    });
  }, [tables, search, statusFilter]);


  // Dolu masalar

  return (
    <div className="p-5">
      <div className="flex justify-between mb-5 pb-3 border-b">
        <h2 className="text-xl font-semibold">Masalar</h2>
        {/*search and fileter alanı */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Masa ara..."
            className="border px-3 py-2 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[160px] rounded-xl bg-background shadow-sm border-gray-300">
              <SelectValue placeholder="Durum seç" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg">
              <SelectItem value="all">Hepsi</SelectItem>
              <SelectItem value="dolu">Dolu</SelectItem>
              <SelectItem value="rezerve">Rezerve</SelectItem>
              <SelectItem value="bos">Boş</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Yeni Masa</Button>

      </div>

      <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-background">
              <TableHead className="py-4 text-gray-700 font-semibold">Sıra</TableHead>
              <TableHead className="py-4 text-gray-700 font-semibold">Masa Adı</TableHead>
              <TableHead className="py-4 text-gray-700 font-semibold">Durum</TableHead>
              <TableHead className="py-4 text-right text-gray-700 font-semibold">İşlemler</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTables.map((t, index) => (
              <TableRow
                key={t._id}
                className="
              transition-all 
              hover:bg-background
              hover:text-background
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
                    bg-red-600 text-foreground
                    text-xs font-semibold 
                    px-3 py-1.5
                    rounded-full shadow-sm
                  "
                    >
                      Dolu
                    </span>
                  ) : t.status === "rezerve" ? (
                    <span
                      className="
                    inline-flex items-center 
                    bg-amber-500 text-white
                    text-xs font-semibold 
                    px-3 py-1.5
                    rounded-full shadow-sm
                  "
                    >
                      Rezerve
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
          onEdit={onSuccess}
          selectetTable={selected}
        />
      )}

      <CreateTable
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        onCreate={onSuccess}

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
