import { useState, useEffect } from "react";
import { AllTable } from "@/models/Tables";
import { useGetTables } from "@/hooks/useGetTables";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import UserOwerViewDialog from "../components/UserOwerViewDialog";


export default function UserOverview() {
  const { tables, getTables } = useGetTables()
  const [open, setOpen] = useState(false);
  const onChange = () => {
    getTables()
  }
  const [selectedTable, setSelectedTable] = useState<AllTable>();

  useEffect(() => {
    getTables()
  }, []);

  const openDialog = (table: AllTable) => { setSelectedTable(table); setOpen(true); };

  return (
    <div className="p-2 flex flex-col gap-6">


      <div className="flex gap-5 flex-wrap">
        {tables.map(t => (
          <div
            key={t._id}
            onClick={() => openDialog(t)}
            className={`w-[120px] p-5 rounded-[10px] cursor-pointer text-center text-white font-bold transition
               ${t.status === "dolu" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-700"}`}
          >
            {t.name}
          </div>
        ))}
      </div>

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
  )
}
