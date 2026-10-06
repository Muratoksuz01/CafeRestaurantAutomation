import { useState, useEffect } from "react";
import { AllTable } from "@/models/Tables";
import { useGetTables } from "@/hooks/useGetTables";
import LeftCartPanel from "./components/LeftCartPanel";
import RightMenuPanel from "./components/RightMenuPanel";
import { Food } from "@/models/Food";

export type BasketItem = Food & { qty: number };

export default function UserOverview() {
  const { tables, getTables } = useGetTables();

  const [selectedTable, setSelectedTable] = useState<AllTable | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [originalBasket, setOriginalBasket] = useState<BasketItem[]>([]);

  useEffect(() => {
    getTables();
  }, []); 

  const resetSelection = () => {
    setSelectedTable(null);
    setBasket([]);
    setOriginalBasket([]);
  };

  const onSuccess = () => {
    getTables();
    resetSelection();
  };

return (
    <div className="grid grid-cols-2 bg-border/20 h-full">

        {/* SOL PANEL */}
        <div className="   ">
            <LeftCartPanel
                tables={tables}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                basket={basket}
                setBasket={setBasket}
                originalBasket={originalBasket}
                setOriginalBasket={setOriginalBasket}
                onSuccess={onSuccess}
                resetSelection={resetSelection}
            />
        </div>

        {/* SAĞ PANEL */}
        <div className="">
            <RightMenuPanel
                selectedTable={selectedTable}
                basket={basket}
                setBasket={setBasket}
            />
        </div>

    </div>
);
}
