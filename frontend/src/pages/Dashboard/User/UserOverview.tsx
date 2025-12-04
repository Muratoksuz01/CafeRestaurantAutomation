import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useGetFoods } from "@/hooks/useGetFoods";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Category, Food } from "@/models/Food";

type Table = { id: number; name: string; status: "boş" | "dolu"; };
// type Category = { id: string; name: string; };
// type Food = { id: string; name: string; price: number; categoryId: string; img?: string; };
type BasketItem = Food & { qty: number; };

const tables: Table[] = [
  { id: 1, name: "Masa 1", status: "boş" },
  { id: 2, name: "Masa 2", status: "dolu" },
  { id: 3, name: "Masa 3", status: "boş" },
];

/* const mockCategories: Category[] = [
  { id: "c1", name: "Çorbalar" },
  { id: "c2", name: "Ana Yemek" },
  { id: "c3", name: "İçecek" },
]; */

/* const mockFoods: Food[] = [
  { id: "f1", name: "Mercimek Çorbası", price: 70, categoryId: "c1" },
  { id: "f2", name: "Kelle Paça", price: 110, categoryId: "c1" },
  { id: "f3", name: "Köfte", price: 200, categoryId: "c2" },
  { id: "f4", name: "Tavuk Izgara", price: 180, categoryId: "c2" },
  { id: "f5", name: "Kola", price: 45, categoryId: "c3" },
]; */

export default function UserOverview() {
  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  // const [foods, setFoods] = useState<Food[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [basket, setBasket] = useState<BasketItem[]>([]);
 const { getFoods, foods, setFoods } = useGetFoods();
  const { categories, getCategories } = useGetCategory();
  // useEffect(() => {
  //   setFoods(mockFoods);
  //   setCategories(mockCategories);
  // }, []);
   useEffect(() => {
    getFoods();
    getCategories()
  }, []);

  const openDialog = (table: Table) => { setSelectedTable(table); setOpen(true); };
  const closeDialog = () => { setOpen(false); setBasket([]); setSelectedCat("all"); setSearch(""); };

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

  const total = basket.reduce((sum, f) => sum + f.price * f.qty, 0);

  const confirmBasket = () => console.log("Sepeti Onayla:", basket);
  const resetBasket = () => setBasket([]);
  const odemeAl = () => console.log("Ödeme Al:", basket);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {tables.map(t => (
          <div
            key={t.id}
            onClick={() => openDialog(t)}
            style={{
              width: 120, padding: 20, borderRadius: 10,
              background: t.status === "dolu" ? "#ff6b6b" : "#51cf66",
              cursor: "pointer", textAlign: "center", color: "#fff", fontWeight: "bold"
            }}
          >
            {t.name}
          </div>
        ))}
      </div>

    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="h-[calc(80vh-2rem)] min-w-[calc(100vh-2rem)] p-0 flex overflow-hidden">
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
      </div>
      <div>Toplam: {total} TL</div>
    </div>
  </DialogContent>
</Dialog>

    </div>
  )
}
