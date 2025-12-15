import { useState, useEffect, useMemo } from "react";
import { AllTable } from "@/models/Tables";
import { useGetTables } from "@/hooks/useGetTables";
import UserOwerViewDialog from "../components/UserOwerViewDialog";
import TableCard from "../components/TableCard";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";



import { PanelRight } from "lucide-react";
import RightSheet from "../components/RightSheet";

export default function UserOverview() {
  const { tables, getTables } = useGetTables();
  const [openSheet, setOpenSheet] = useState(false)
  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<AllTable>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "dolu" | "bos" | "rezerve">("all");

  const onChange = () => getTables();

  useEffect(() => {
    getTables();
  }, []);

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
  const fullTables = useMemo(
    () => tables.filter((t) => t.status === "dolu"),
    [tables]
  );

  const totalAmount = useMemo(
    () => fullTables.reduce((sum, t) => sum + (Number(t.orderTotal) || 0), 0),
    [fullTables]
  );

  return (
    <div className="p-2 flex flex-col gap-6 relative">

      {/* SHEET TRIGGER - SAĞ ÜST DAİRE BUTON */}
      <button
        className="absolute top-2 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition"
        onClick={() => setOpenSheet(true)}
      >
        <PanelRight size={20} />
      </button>
      <RightSheet fullTables={fullTables} openSheet={openSheet} setOpenSheet={setOpenSheet} totalAmount={totalAmount} />
      {/* ARAMA + FİLTRE */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Masa ara..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[160px] rounded-xl bg-white shadow-sm border-gray-300">
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

      {/* MASA LİSTESİ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-6">
        {filteredTables.map((t) => (
          <TableCard
            key={t._id}
            table={t}
            onClick={() => {
              setSelectedTable(t);
              setOpen(true);
            }}
          />
        ))}
      </div>

      {/* MASA DİYALOĞU */}
      {selectedTable && (
        <UserOwerViewDialog
          open={open}
          setOpen={setOpen}
          selectedTable={selectedTable}
          onChange={onChange}
          allTable={tables}
          setSelectedTable={setSelectedTable}
        />
      )}
    </div>
  );
}
