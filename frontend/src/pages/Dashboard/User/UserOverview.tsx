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
  
  {/* ÜST HEADER ALANI: Arama, Filtre ve Panel Butonu */}
  <div className="flex flex-row items-center gap-3 w-full">
    
    {/* ARAMA + FİLTRE PANELİ */}
    <div className="flex flex-1 flex-col sm:flex-row gap-2 sm:gap-4 items-center bg-card/40 p-2 sm:p-3 rounded-2xl border border-border/50 backdrop-blur-md">
      {/* Arama Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Masa ara..."
          className="pl-10 bg-background/50 border-none focus-visible:ring-primary/50 h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Ayırıcı Çizgi (Sadece Masaüstünde Şık Durur) */}
      <div className="hidden sm:block w-[1px] h-6 bg-border/50" />

      {/* Filtre Select */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="h-4 w-4 text-muted-foreground ml-2 hidden sm:block" />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[140px] border-none bg-background/50 shadow-none focus:ring-0 h-10">
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

    {/* SAĞ PANEL BUTONU (Artık Absolute Değil, Yerini Koruyor) */}
    <Button
      variant="outline"
      size="icon"
      className="shrink-0 w-11 h-11 rounded-xl shadow-md bg-card/80 backdrop-blur-sm border-border hover:bg-accent transition-all hover:scale-105 active:scale-95"
      onClick={() => setOpenSheet(true)}
    >
      <PanelRight size={22} className="text-foreground" />
    </Button>
  </div>

  <RightSheet
    fullTables={fullTables}
    openSheet={openSheet}
    setOpenSheet={setOpenSheet}
    totalAmount={totalAmount}
  />

  {/* MASA LİSTESİ */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
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
