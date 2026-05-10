import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input";
import { toast } from "sonner"; import { ApiResponse } from "@/lib/apiTypes";
import { Food, Printers } from "@/models/Food"; import { AllTable } from "@/models/Tables";
import { API_BASE_URL, API_PATHS } from "@/lib/api"; import axiosInstance from "@/lib/axiosInstance";
import CustomAlertDialog from "@/pages/Dashboard/components/CustomAlertDialog";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import useAuthStore from "@/store/useAuthStore";
import { CalendarCheck, CalendarX, Printer, X } from "lucide-react";
import RezerveDialog from "./RezerveDialog";
import { useIsMobile } from "@/lib/use-mobile";
import { useGetCategory } from "@/hooks/useGetCategory"; import { useGetFoods } from "@/hooks/useGetFoods";
import { useGetPrinter } from "@/hooks/useGetPrinter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Basket = Food & { qty: number };
function UserOwerViewDialog({ selectedTable, open, setOpen, onChange, allTable, setSelectedTable }: { selectedTable: AllTable, open: boolean, setOpen: any, onChange: any, allTable: AllTable[], setSelectedTable: any }) {
  const { categories, getCategories } = useGetCategory();
  const { printers, getPrinters } = useGetPrinter()
  const { getFoods, foods, } = useGetFoods();
  const isMobile = useIsMobile()
  const user = useAuthStore((state) => state.user);
  const [showRezerveDialog, setShowRezerveDialog] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [originalBasket, setOriginalBasket] = useState<any[]>([]);
  const [basket, setBasket] = useState<Basket[]>([]);
  const total = basket && basket.reduce((sum, f) => sum + f.price * f.qty, 0);
  const resetBasket = () => setBasket([]);
  const addFood = (food: Food) => {
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
      if (res.data.status) {
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
      const res = await axiosInstance.put(API_PATHS.editOrder, { tableId: selectedTable?._id, basket, total, orderId: selectedTable.currentOrderId })
      // console.log("edit  işlemi:",{ tableId: selectedTable?._id, basket, total, orderId: selectedTable.adisyon.id });
      if (res.data.status) {
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
    if (res.data.status) {
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
      if (res.data.status) {
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

  /*  const onClose = () => {
     const changed = JSON.stringify(basket) !== JSON.stringify(originalBasket);
     if (changed) {
       toast.warning("degiişklikler kaydediilmedi", warningStyle)
     } else {
       setOpen(false)
       setBasket([])
     }
   } */
  const fetchTable = async (id: string) => {
    const res = await axiosInstance.get(API_PATHS.getTable(id))
    if (res.data.status) {
      // setTable(res.data.data)
      setBasket(res.data.data?.adisyon?.map((i: any) => ({
        _id: i.foodId,       // foods ile uyumlu olsun
        name: i.name,
        price: i.price,
        qty: i.qty
      })));
      setOriginalBasket(res.data.data?.adisyon?.map((i: any) => ({
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
    const initData = async () => {
      if (open && selectedTable?._id) {
        await fetchTable(selectedTable._id)
        await getFoods()
        await getCategories()
        await getPrinters()
      }
    };

    initData();
  }, [open, selectedTable?._id]);

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
      if (res.data.status) {
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
  const handleBook = async (table: AllTable) => {
    if (table.status !== "rezerve") {
      return setShowRezerveDialog(true);
    }
    try {
      const res = await axiosInstance.delete<ApiResponse>(API_PATHS.deleteRezervasyon(table._id));
      if (res.data.status) {
        onChange()
        toast.success(res.data.message || "Rezervasyon Silindi", successStyle)
        setOpen(false)
      } else {
        toast.warning(res.data.message || "Hata:Rezervasyon Silinemedi", warningStyle)
      }
    } catch (error: any) {
      console.error("Silme işlemi başarısız:", error);
      toast.warning(error.res.data.message || "Sistemsel bir hata var Rezervasyon Silinemedi", warningStyle)
    }
  };
const handlePrint = async (printerId: number) => {
  try {
    const orderId = selectedTable.currentOrderId;
    if (!orderId) return;

    const response = await axiosInstance.post('/api/orders/print', {
      printerId,
      orderId
    });

    if (response.status === 200) {
      console.log("Yazdırma işlemi başarılı");
      // İstersen burada bir toast mesajı gösterebilirsin
    }
  } catch (error) {
    console.error("Yazdırma hatası:", error);
  }
};
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOriginalBasket([])
          setBasket([])
          setOpen(false)
        }}
      >
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="w-full max-w-[100vw] h-dvh p-0 flex flex-col overflow-hidden rounded-none sm:rounded-xl md:flex-row md:max-w-[1200px] md:h-[85vh]"
        >
          {/* SOL TARAF / MOBİLDE ÜST TARAF: Ürün Listesi */}
          <div className={`w-full ${isMobile ? 'h-full' : 'md:w-1/2'} flex flex-col border-b md:border-b-0 md:border-r overflow-hidden min-h-0`}>
            <div className="p-3 sm:p-4 bg-background border-b sticky top-0 z-10 flex flex-col sm:flex-row items-center gap-2">
              <div className="flex w-full gap-2 flex-1">
                <Input
                  placeholder="Ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />

                {/* MOBİLDE GÖRÜNÜR: Arama çubuğunun hemen sağında */}
                <DialogClose asChild className="sm:hidden">
                  <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>

              <Select value={selectedCat} onValueChange={setSelectedCat}>
                <SelectTrigger className="w-full sm:w-[150px]">
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

              {/* MASAÜSTÜNDE GÖRÜNÜR: Kategori seçiminin sağında */}
              <DialogClose asChild className="hidden sm:flex">
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 bg-background min-h-0">
              {filteredFoods.map((food) => {
                // Ürünün sepette olup olmadığını ve miktarını buluyoruz
                const basketItem = basket?.find((item: Basket) => item._id == food._id)

                return (
                  <div
                    key={food._id}
                    className="bg-background shadow-sm hover:shadow-md border rounded-xl p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                        <img
                          className="h-full w-full object-cover"
                          src={food.imgs?.[0] ? `${API_BASE_URL}${food.imgs[0]}` : "/placeholder.png"}
                          alt={food.name}
                        />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="font-semibold text-sm sm:text-base capitalize leading-tight truncate">
                          {food.name}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mt-1">
                          {food.price} TL
                        </div>
                      </div>
                    </div>

                    {/* MİKTAR VE EKLEME KONTROLLERİ */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {basketItem ? (
                        <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1 border">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-md"
                            onClick={() => removeFood(String(food._id))}
                          >
                            -
                          </Button>
                          <span className="w-4 text-center font-bold text-sm">
                            {basketItem.qty}
                          </span>
                          <Button
                            size="icon"
                            variant="default"
                            className="h-8 w-8 rounded-md"
                            onClick={() => addFood(food)}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="rounded-lg px-6"
                          onClick={() => addFood(food)}
                        >
                          Ekle
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* MOBİL İÇİN ALT BAR: Toplam Tutar ve Ana Butonlar (Sadece mobilde sol tarafa ekliyoruz ki kaybolmasın) */}
            {isMobile && (
              <div className="bg-background border-t p-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-sm font-medium text-muted-foreground">Masa: {selectedTable?.name}</span>
                  <span className="text-lg font-bold text-primary">Toplam: {total} TL</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={confirmBasket}
                    variant="default"
                    className="flex-1 h-12 text-sm font-bold"
                  >
                    Sepeti Onayla
                  </Button>
                  {user!.role !== "Garson" && (
                    <Button
                      onClick={odemeAl}
                      className="flex-1 h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                    >
                      Ödeme Al
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SAĞ TARAF / MASAÜSTÜ SEPET DETAYI (Mobilde tamamen gizli) */}
          {!isMobile && (
            <div className="w-full md:w-1/2 flex flex-col p-3 sm:p-4 bg-background min-h-0 overflow-hidden">
              <div className="sticky top-0 bg-background pb-3 border-b z-10">
                <DialogTitle className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-base sm:text-lg">
                  <span className="wrap-break-word">
                    {selectedTable?.name} – Sepet
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedTable.currentOrderId == null ? (
                      <Button
                        size="sm"
                        variant={selectedTable.status === "rezerve" ? "destructive" : "outline"}
                        className="flex gap-2 items-center"
                        onClick={() => handleBook(selectedTable)}
                      >
                        {selectedTable.status === "rezerve" ? (
                          <>
                            <CalendarX className="h-4 w-4" />
                            <span>Rezervasyonu İptal Et</span>
                          </>
                        ) : (
                          <>
                            <CalendarCheck className="h-4 w-4" />
                            <span>Rezerve Et</span>
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        {/* Eğer kayıtlı printer varsa direkt buton, yoksa dropdown */}
                        {localStorage.getItem("selected_printer") ? (
                          <Button
                            variant="default"
                            className="flex gap-2 items-center"
                            onClick={() => {
                              const savedId = localStorage.getItem("selected_printer");
                              handlePrint(Number(savedId));
                            }}
                          >
                            <Printer className="h-4 w-4" />
                            <span>Yazdır</span>
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="default" className="flex gap-2 items-center">
                                <Printer className="h-4 w-4" />
                                <span>Yazıcı Seç ve Yazdır</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {printers.map((p: Printers) => (
                                <DropdownMenuItem
                                  key={p._id}
                                  onClick={() => {
                                    localStorage.setItem("selected_printer", JSON.stringify(p));
                                    handlePrint(p._id);
                                  }}
                                >
                                  {p.name} ({p.printerIp})
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </>
                    )}

                    <DialogClose>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Kapat</span>
                      </Button>
                    </DialogClose>
                  </div>
                </DialogTitle>
              </div>

              {/* Sepet Detay Listesi */}
              <div className="flex-1 overflow-y-auto py-3 sm:py-4 flex flex-col gap-3 min-h-0">
                {!basket?.length && (
                  <p className="text-foreground text-center mt-10">Henüz ürün yok.</p>
                )}

                {basket?.map((item) => (
                  <div
                    key={item._id}
                    className="shadow-sm border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-foreground">
                        {item.price} TL × {item.qty}
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto">
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

              {/* Masaüstü Butonlar ve Toplam */}
              <div className="flex flex-col gap-3 mt-4 border-t pt-4">
                <div className="text-lg font-semibold mb-1">
                  Toplam: {total} TL
                </div>

                <div className="flex flex-row gap-2">
                  <Button
                    onClick={confirmBasket}
                    variant="default"
                    className="flex-2 h-12 text-base font-bold"
                  >
                    Sepeti Onayla
                  </Button>

                  {user!.role !== "Garson" && (
                    <Button
                      onClick={odemeAl}
                      className="flex-3 h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                    >
                      Ödeme Al
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!selectedTable.currentOrderId}
                    onClick={resetBasket}
                    className="text-xs disabled:cursor-not-allowed disabled:pointer-events-auto"
                  >
                    Sıfırla
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!selectedTable.currentOrderId}
                    onClick={() => setShowTableDialog(true)}
                    className="text-xs cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-auto"
                  >
                    Masa Değiştir
                  </Button>

                  <DialogClose asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      Kapat
                    </Button>
                  </DialogClose>
                </div>

                {user!.role !== "Garson" && (
                  <Button
                    onClick={() => setDeleteAlert(true)}
                    disabled={selectedTable.currentOrderId ? false : true}
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-destructive/10 text-xs font-semibold uppercase tracking-widest"
                  >
                    Siparişi Tamamen Sil
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Masa Değiştir</DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto pr-1 mt-4">
            {allTable.filter((t: AllTable) => t._id !== selectedTable?._id && (t.status !== "dolu" && t.status !== "rezerve")).length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-10">
                Uygun masa yok
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {allTable
                  .filter((t: any) => t._id !== selectedTable?._id)
                  .map((t: any) => {

                    return (
                      <Button
                        key={t._id}
                        onClick={() => handleSelectTable(t)}
                        className={`rounded-xl border text-sm sm:text-base font-medium transition cursor-pointer bg-green-200 text-green-800 border-green-300 hover:bg-green-300`}
                      >
                        {t.name}
                      </Button>
                    )
                  })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <RezerveDialog
        setOpen={setOpen}
        showRezerveDialog={showRezerveDialog}
        setShowRezerveDialog={setShowRezerveDialog}
        masaId={selectedTable._id}
        onSuccess={onChange}
      />

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