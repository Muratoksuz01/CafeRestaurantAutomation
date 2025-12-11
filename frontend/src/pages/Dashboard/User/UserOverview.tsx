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
} from "@/components/ui/select"
export default function UserOverview() {
  const { tables, getTables } = useGetTables();

  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<AllTable>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "dolu" | "bos">("all");

  const onChange = () => getTables();

  useEffect(() => {
    getTables();
  }, []);

  const openDialog = (table: AllTable) => {
    setSelectedTable(table);
    setOpen(true);
  };

  // Filtrelenen tablo listesi
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true
          : statusFilter === "dolu" ? t.status === "dolu"
            : t.status !== "dolu"; // boş

      return matchSearch && matchStatus;
    });
  }, [tables, search, statusFilter]);

  return (
    <div className="p-2 flex flex-col gap-6">

      {/* Arama ve filtre */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Masa ara..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as any)}
        >
          <SelectTrigger className="w-[160px] rounded-xl bg-white shadow-sm border-gray-300">
            <SelectValue placeholder="Durum seç" />
          </SelectTrigger>

          <SelectContent className="rounded-xl shadow-lg">
            <SelectItem value="all">Hepsi</SelectItem>
            <SelectItem value="dolu">Dolu</SelectItem>
            <SelectItem value="bos">Boş</SelectItem>
          </SelectContent>
        </Select>


      </div>

      {/* Masalar */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-6" >
        {filteredTables.map(t => (
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


      {/* Dialog */}
      {selectedTable && (
        <UserOwerViewDialog
          open={open}
          setOpen={setOpen}
          selectedTable={selectedTable}
          onChange={onChange}
          allTable={tables}
        />
      )}
    </div>
  );
}
