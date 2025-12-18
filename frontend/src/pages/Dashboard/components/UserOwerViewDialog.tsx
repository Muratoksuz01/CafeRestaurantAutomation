import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { useGetFoods } from "@/hooks/useGetFoods";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Food } from "@/models/Food";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { AllTable } from "@/models/Tables";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getRole } from "@/lib/utils";
type Basket = Food & { qty: number };
function UserOwerViewDialog({ selectedTable, open, setOpen, onChange, allTable, setSelectedTable }: { selectedTable: AllTable, open: boolean, setOpen: any, onChange: any, allTable: any, setSelectedTable: any }) {
  const { categories, getCategories } = useGetCategory();
  const { getFoods, foods, } = useGetFoods();
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [originalBasket, setOriginalBasket] = useState<any[]>([]);
  const [basket, setBasket] = useState<Basket[]>([]);
  const total = basket && basket.reduce((sum, f) => sum + f.price * f.qty, 0);
  const resetBasket = () => setBasket([]);
  const { user } = useSelector((state: RootState) => state.auth); const addFood = (food: Food) => {
    if (!basket) {
      setBasket([{ ...food, qty: 1 }]);
      return;
    }
    const existing = basket.find(b => b._id === food._id);
    if (existing) setBasket(basket.map(b => b._id === food._id ? { ...b, qty: b.qty + 1 } : b));
    else setBasket([...basket, { ...food, qty: 1 }]);
  };
  const confirmBasket = async () => {
    const changed = JSON.stringify(basket) !== JSON.stringify(originalBasket);
    const hasOriginal = originalBasket && originalBasket.length > 0;
    const isBasketEmpty = basket.length === 0;

    // DURUM 1 → Yeni sipariş
    if (!hasOriginal) {
      if (isBasketEmpty) {
        // yeni sipariş veriyor ama sepet boş
        toast.error("Sepet boş, sipariş oluşturulamaz.");
        return;
      }

      const res = await axiosInstance.post(API_PATHS.createOrder, { tableId: selectedTable?._id, basket, total })
      if (res.data.success) {
        toast.success("basarılı bir sekilde kaydedildi", successStyle)
        setOpen(false); setBasket([]);
        onChange && onChange()
      } else {
        toast.warning(res.data.message, warningStyle)
      }
      // console.log("create işlemi:", { tableId: selectedTable?._id, basket, total });

      return;
    }

    // DURUM 2 → Güncelleme var mı?
    if (changed) {
      // Sepet tamamen boş → edit yapılamaz
      if (isBasketEmpty) {
        toast.error("Sipariş boş olamaz. En az bir ürün seçmelisiniz.");
        return;
      }

      // Güncelleme uyarısı
      const res = await axiosInstance.post(API_PATHS.editOrder, { tableId: selectedTable?._id, basket, total, orderId: selectedTable.currentOrderId })
      // console.log("edit  işlemi:",{ tableId: selectedTable?._id, basket, total, orderId: selectedTable.adisyon.id });
      if (res.data.success) {
        setOpen(false); setBasket([]);
        toast.success("basarılı bir sekilde kaydedildi", successStyle)
        onChange && onChange()
        return;
      } else {
        toast.warning(res.data.message, warningStyle)
      }
    } else {
      toast.warning("herhangi bir degisiklik yok", warningStyle)
    }


  };
  const removeFood = (foodId: string) => {
    const existing = basket.find(b => String(b._id) === foodId);
    if (!existing) return;
    if (existing.qty === 1) setBasket(basket.filter(b => String(b._id) !== foodId));
    else setBasket(basket.map(b => String(b._id) === foodId ? { ...b, qty: b.qty - 1 } : b));
  };
  const deleteOrder = async () => {
    // once dlete alert gosterecegiz sonra sipariş silinsin 
    if (!selectedTable?.currentOrderId) {
      toast.warning("once siparis olusturmalısınız", warningStyle)
      return;
    }
    const res = await axiosInstance.delete(API_PATHS.deleteOrder, {
      data: { orderId: selectedTable?.currentOrderId }
    });
    console.log(res.data)
    if (res.data.success) {
      resetBasket()
      setOpen(false)
      toast.success("sipairis silindi", successStyle)
      onChange && onChange()
    } else {
      toast.warning(res.data.message || "istek hatası ", warningStyle)
    }
  }
  const odemeAl = async () => {
    const isBasketEmpty = basket.length === 0;
    if (isBasketEmpty) {
      toast.error("Sipariş boş olamaz. En az bir ürün seçmelisiniz.");
      return;
    }
    console.log(selectedTable)
    if (selectedTable.currentOrderId) {
      const res = await axiosInstance.post(API_PATHS.paidOrder, { tableId: selectedTable?._id, basket, total, orderId: selectedTable.currentOrderId })
      if (res.data.success) {
        setOpen(false); setBasket([]);
        toast.success("basarılı bir sekilde odeme alındı ", successStyle)
        onChange && onChange()
        return;
      } else {
        toast.warning(res.data.message, warningStyle)
      }
    } else {
      toast.warning("once siparişi onaylamalısınız", warningStyle)
    }
  }
  const onClose = () => {
    const changed = JSON.stringify(basket) !== JSON.stringify(originalBasket);
    if (changed) {
      toast.warning("degiişklikler kaydediilmedi", warningStyle)
    } else {
      setOpen(false)
      setBasket([])
    }
  }
  const fetchTable = async (id: string) => {
    const res = await axiosInstance.get(API_PATHS.getTable, {
      params: { id: id }
    })
    if (res.data.success) {
      // setTable(res.data.data)
      setBasket(res.data.data?.adisyon?.items.map((i: any) => ({
        _id: i.foodId,       // foods ile uyumlu olsun
        name: i.name,
        price: i.price,
        qty: i.qty
      })));
      setOriginalBasket(res.data.data?.adisyon?.items.map((i: any) => ({
        _id: i.foodId,       // foods ile uyumlu olsun
        name: i.name,
        price: i.price,
        qty: i.qty
      })));

    } else {
      toast.error(res.data.message, warningStyle)
    }
  }
  useEffect(() => {
    if (selectedTable) {
      console.log(selectedTable);
      getCategories()
      getFoods();
      fetchTable(selectedTable?._id || "")
    }
  }, [selectedTable]);

  const filteredFoods = foods
    .filter(f => selectedCat === "all" ? true : f.categoryId === selectedCat)
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelectTable = async (table: any) => {
    if (table.status != "dolu") {
      const res = await axiosInstance.put(API_PATHS.reassignTables, {
        oldTableId: selectedTable._id,
        newTableId: table._id,
        orderId: selectedTable.currentOrderId
      });
      if (res.data.success) {
        setShowTableDialog(false)
        setOpen(false)
        toast.success("basarılı bir sekilde masalar degiştirildi", successStyle)
        onChange && onChange()
      } else {
        toast.warning(res.data.message || "bira hata olsutu", warningStyle)
      }
    }
    console.log(table);

  }
  const handleBook = async (id: string) => {
    console.log("rezrve edilen masa id:", id);
    // burada orderd varsa baska işlemler yapılmalı bu işi kontrol edilmeli
    const res = await axiosInstance.put(API_PATHS.handleBook(id))
    if (res.data.success) {
      toast.success(res.data.message || "işlem basarılı", successStyle)
      setOpen(false);
      onChange && onChange()

    } else {
      toast.success(res.data.message || "işlem basarısız", warningStyle)

    }
  }
  return (
    <>

      <Dialog open={open} onOpenChange={() => {
        setSelectedTable({})
        setBasket([])
        setOriginalBasket([])
        setOpen(false)
      }}>
        <DialogContent
          className="w-full max-w-[95vw] h-[85vh] p-0 flex flex-col overflow-hidden md:flex-row md:max-w-[1200px] "
        >
          {/* LEFT */}
          <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r overflow-hidden">

            {/* Sticky Filters */}
            <div className="p-4 bg-white border-b sticky top-0 z-10 flex gap-2">
              <Input
                placeholder="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />

              <Select value={selectedCat} onValueChange={setSelectedCat}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* FOOD LIST */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
              {filteredFoods.map((food) => {
                const inBasket =
                  basket && basket.some(
                    (item: any) => item._id === food._id
                  ) || false;

                return (
                  <div
                    key={food._id}
                    className="bg-white shadow-sm hover:shadow border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-gray-500">{food.price} TL</div>
                    </div>

                    <div className="flex gap-2">
                      {inBasket && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFood(String(food._id))}
                        >
                          -
                        </Button>
                      )}
                      <Button size="sm" onClick={() => addFood(food)}>
                        Ekle
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2 flex flex-col p-4 bg-white">

            {/* Sticky Header */}
            <div className="sticky top-0 bg-white pb-3 border-b z-10">
              <DialogTitle className="flex justify-between">
                <span>
                  {selectedTable?.name} – Sepet
                </span>
                <div>
                  {/* buraya kosullar ekle sipariş ıd varsa gosterilesin ve zaten rezerve ise gosterilmesin */}
                  {selectedTable.currentOrderId == null && (
                    <Button
                      size="sm"
                      variant={selectedTable.status === "rezerve" ? "destructive" : "default"}
                      onClick={() => handleBook(selectedTable._id)}
                    >
                      {selectedTable.status === "rezerve"
                        ? "Rezervasyonu İptal Et"
                        : "Rezerve Et"}
                    </Button>

                  )}

                </div>
              </DialogTitle>
            </div>

            {/* Basket Items */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
              {!basket && (
                <p className="text-gray-500 text-center mt-10">Henüz ürün yok.</p>
              )}

              {basket && basket.map((item) => (
                <div
                  key={item._id}
                  className="shadow-sm border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.price} TL × {item.qty}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => removeFood(String(item._id))}>
                      -
                    </Button>
                    <Button size="sm" onClick={() => addFood(item)}>
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Button onClick={confirmBasket} className="flex-1">
                Sepeti Onayla
              </Button>
              <Button onClick={resetBasket} variant="secondary" className="flex-1">
                Reset
              </Button>
              {
                getRole() != "Garson" && (
                  <Button onClick={odemeAl} variant="destructive" className="flex-1">
                    Ödeme Al
                  </Button>
                )
              }
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Kapat
              </Button>
              {getRole() != "Garson" && (
                <Button onClick={() => setDeleteAlert(true)} variant="destructive" className="flex-1">
                  Siparişi Sil
                </Button>
              )}
              <Button variant="secondary" onClick={() => setShowTableDialog(true)}>
                Masa Değiştir
              </Button>
            </div>

            <div className="text-lg font-semibold border-t pt-3">
              Toplam: {total} TL
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Masa Değiştir</DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto pr-1">
            <div className="grid grid-cols-3 gap-4 mt-4">
              {allTable
                .filter((t: any) => t._id !== selectedTable?._id)
                .map((t: any) => {
                  const isFull = t.status === "dolu";
                  return (
                    <Button
                      key={t._id}
                      disabled={isFull}
                      onClick={() => handleSelectTable(t)}
                      className={`rounded-xl border text-base font-medium transition cursor-pointer ${isFull
                        ? "bg-red-200 text-red-700 border-red-300 cursor-not-allowed"
                        : "bg-green-200 text-green-800 border-green-300 hover:bg-green-300"
                        }
                           `}
                    >
                      {t.name}
                    </Button>
                  );
                })}
            </div>
          </div>


        </DialogContent>
      </Dialog>

      <CustomAlertDialog
        open={deleteAlert}
        onOpenChange={setDeleteAlert}
        title="Sipariş silinsin mi?"
        description="Bu işlem geri alınamaz."
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        onConfirm={deleteOrder}
      />


    </>
  )
}

export default UserOwerViewDialog