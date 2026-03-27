import { useState, useEffect, useMemo } from "react";
import { AllTable } from "@/models/Tables";
import { useGetTables } from "@/hooks/useGetTables";
import UserOwerViewDialog from "./components/UserOwerViewDialog";
import TableCard from "./components/TableCard";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";



import { Filter, PanelRight, Search } from "lucide-react";
import RightSheet from "./components/RightSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetRezerve } from "@/hooks/useGetRezerve";

export default function UserOverview() {
  const { tables, getTables } = useGetTables();
  const { rezerve, getRezerve } = useGetRezerve();
  const [openSheet, setOpenSheet] = useState(false)
  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<AllTable>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "dolu" | "bos" | "rezerve">("all");

  const onSuccess = () => getTables();

  useEffect(() => {
    const fetchTables = async () => {
      await getTables();
      await getRezerve()
    }
    fetchTables()
    //  console.log("masa listesi:",tables)
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
    <div className="p-4 flex flex-col gap-8 relative min-h-screen bg-transparent animate-in fade-in duration-700">


      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-4 rounded-full shadow-md bg-card/80 backdrop-blur-sm border-border hover:bg-accent transition-all hover:scale-110"
        onClick={() => setOpenSheet(true)}
      >
        <PanelRight size={20} className="text-foreground" />
      </Button>

      <RightSheet
        fullTables={fullTables}
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        totalAmount={totalAmount}
      />

      {/* ARAMA + FİLTRE PANELİ */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card/40 p-3 rounded-2xl border border-border/50 backdrop-blur-md w-fit">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Masa ara..."
            className="pl-10 bg-background/50 border-none focus-visible:ring-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground ml-2" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[140px] border-none bg-background/50 shadow-none focus:ring-0">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover">
              <SelectItem value="all">Tüm Masalar</SelectItem>
              <SelectItem value="dolu">Dolu</SelectItem>
              <SelectItem value="rezerve">Rezerve</SelectItem>
              <SelectItem value="bos">Boş</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MASA LİSTESİ */}
      {/* Grid yapısını biraz daha ferahlattık */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
        {filteredTables.map((t) => (
          <TableCard
            rezerve={rezerve}
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
          onChange={onSuccess}
          allTable={tables}
          setSelectedTable={setSelectedTable}
        />
      )}
    </div>
  );
}
