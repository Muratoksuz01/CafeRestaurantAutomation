import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle,  } from "@/components/ui/dialog";
import { useGetFoods } from "@/hooks/useGetFoods";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Food } from "@/models/Food";
import { MyTable } from "@/models/Tables";
import { useGetTables } from "@/hooks/useGetTables";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";

// type Category = { id: string; name: string; };
// type Food = { id: string; name: string; price: number; categoryId: string; img?: string; };
type BasketItem = Food & { qty: number; };

export default function UserOverview() {
  const { tables, getTables } = useGetTables()
  const { getFoods, foods,  } = useGetFoods();
  const { categories, getCategories } = useGetCategory();

  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<MyTable | null>(null);

  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const total = basket.reduce((sum, f) => sum + f.price * f.qty, 0);

  useEffect(() => {
    getTables()
    getCategories()
    getFoods();
  }, []);

  const openDialog = (table: MyTable) => { setSelectedTable(table); setOpen(true); };
  const closeDialog = () => { setOpen(false); setBasket([]); setSelectedCat("all"); setSearch(""); };
  const confirmBasket = async () =>{
    const res=await axiosInstance.post(API_PATHS.createOrder,{tableId:selectedTable?._id,basket,total})
    console.log(selectedTable?._id)
     console.log("Sepeti Onayla:", basket);
     console.log(total)
     closeDialog()
     getTables()
  }
  const filteredFoods = foods
    .filter(f => selectedCat === "all" ? true : f.categoryId === selectedCat)
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const addFood = (food: Food) => {
    const existing = basket.find(b => b._id === food._id);
    if (existing) setBasket(basket.map(b => b._id === food._id ? { ...b, qty: b.qty + 1 } : b));
    else setBasket([...basket, { ...food, qty: 1 }]);
  };
  const removeFood = (foodId: string) => {
    const existing = basket.find(b => String(b._id) === foodId);
    if (!existing) return;
    if (existing.qty === 1) setBasket(basket.filter(b => String(b._id) !== foodId));
    else setBasket(basket.map(b => String(b._id) === foodId ? { ...b, qty: b.qty - 1 } : b));
  };
  const deleteOrder = () => {
    // once dlete alert gosterecegiz sonra sipariş silinsin 
    console.log("bu masanın siparişlerim silinidi", selectedTable?._id)
    resetBasket()
  }



  const resetBasket = () => setBasket([]);
  const odemeAl = () => console.log("Ödeme Al:", basket);

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


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[calc(80vh-2rem)] min-w-[calc(120vh-2rem)] p-0 flex overflow-hidden">
          {/* LEFT */}
          <div className="w-1/2 flex flex-col border-r overflow-hidden">
            <div className="flex gap-2 p-4">
              <Input placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} />
              <Select value={selectedCat} onValueChange={setSelectedCat}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {filteredFoods.map(food => {
                const inBasket = basket.find(b => b._id === food.id);
                return (
                  <div key={food.id} className="flex justify-between items-center border rounded p-2">
                    <div>
                      <div>{food.name}</div>
                      <div>{food.price} TL</div>
                    </div>
                    <div className="flex gap-2">
                      {inBasket && <Button size="sm" onClick={() => removeFood(food.id)}>-</Button>}
                      <Button size="sm" onClick={() => addFood(food)}>Ekle</Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-1/2 flex flex-col p-4">
            <h3>{selectedTable?.name} – Sepet</h3>
            <div className="flex-1 overflow-y-auto mb-4">
              {basket.length === 0 && <p>Henüz ürün yok.</p>}
              {basket.map(item => (
                <div key={item._id} className="flex justify-between mb-2">
                  <div>{item.name} – {item.price} TL x {item.qty}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => removeFood(String(item._id))}>-</Button>
                    <Button size="sm" onClick={() => addFood(item)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <Button onClick={confirmBasket}>Sepeti Onayla</Button>
              <Button onClick={resetBasket} variant="secondary">Reset</Button>
              <Button onClick={odemeAl} variant="destructive">Ödeme Al</Button>
              <Button onClick={closeDialog} variant="outline">Kapat</Button>
              <Button onClick={deleteOrder} variant="destructive">Siparişi Sil</Button>
            </div>
            <div>Toplam: {total} TL</div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
