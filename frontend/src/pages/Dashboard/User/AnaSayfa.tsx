import { useState, useMemo, useEffect } from "react";
import {Search, Plus, Minus,
  Coffee, X, Printer, CreditCard,
  Trash2, Utensils, Loader2,
  ArrowLeft,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { useGetTables } from "@/hooks/useGetTables";
import { useGetFoods } from "@/hooks/useGetFoods";
import { useGetCategory } from "@/hooks/useGetCategory";
import { useGetPrinter } from "@/hooks/useGetPrinter";
import { AllTable } from "@/models/Tables";
import { Food } from "@/models/Food";
import { API_BASE_URL, API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import CustomAlertDialog from '@/pages/Dashboard/components/CustomAlertDialog';
import { CreateOrder, EditOrder, GetTable } from "@/lib/apiResponseTypes";
import { ApiResponse } from "@/lib/apiTypes";

// Sepet Öğesi Arayüzü
export interface BasketItem {
  _id: string | number;
  name: string;
  price: number;
  qty: number;
  imgs?: any;
}

export default function AnaSayfa() {
  // API Hook'ları
  const { tables, getTables, loading: tablesLoading } = useGetTables();
  const { foods, getFoods, loading: foodsLoading } = useGetFoods();
  const { categories, getCategories } = useGetCategory();
  const { printers, getPrinters } = useGetPrinter();

  // Durum Eyaletleri (State)
  const [selectedTable, setSelectedTable] = useState<AllTable | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [originalBasket, setOriginalBasket] = useState<BasketItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printAlert, setPrintAlert] = useState(false);

  // 1. Sayfa yüklendiğinde verileri çek & sayfa dışı kaydırmayı kilitle
  useEffect(() => {
    getTables();
    getFoods();
    getCategories();
    getPrinters();
    // Sayfa dışı scrollbar kilit mekanizması
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // 2. Bir masa seçildiğinde masanın aktif adisyonunu getir
  useEffect(() => {
    const fetchTableAdisyon = async (tableId: string) => {
      try {
        const res = await axiosInstance.get<ApiResponse<GetTable>>(API_PATHS.getTable(tableId));
        console.log(res.data.data)
        if (res.data.status && res.data.data.adisyon) {
          const remoteItems: BasketItem[] =
            res.data.data.adisyon.map((item: any) => ({
              _id: item.foodId || item._id,
              name: item.name,
              price: item.price,
              qty: item.qty,
            })) || [];
          setBasket(remoteItems);
          setOriginalBasket(remoteItems);
        } else {
          setBasket([]);
          setOriginalBasket([]);
        }
      } catch {
        setBasket([]);
        setOriginalBasket([]);
      }
    };

    if (selectedTable?._id) {
      fetchTableAdisyon(selectedTable._id);
    } else {
      setBasket([]);
      setOriginalBasket([]);
    }
  }, [selectedTable?._id]);

  // Filtrelenmiş Yemekler (Kategori ve Arama Filtresi)
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchCat =
        selectedCategory === "all" || String(f.categoryId) === String(selectedCategory);
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [foods, selectedCategory, search]);

  // Toplam Tutar ve Adet Hesaplama
  const totalAmount = useMemo(
    () => basket.reduce((sum, item) => sum + item.price * item.qty, 0),
    [basket]
  );
  const totalItemCount = useMemo(
    () => basket.reduce((sum, item) => sum + item.qty, 0),
    [basket]
  );

  // Masaya Tıklama Olayı (Masaüstünde seçer, mobilde modalı açar)
  const handleSelectTable = (table: AllTable) => {
    setSelectedTable(table);
    if (window.innerWidth < 768) {
      setMobileOpen(true);
    }
  };
  const handlePrinter = async (title: string, selectedOrderId: string) => {
    try {
      const savedSettings = localStorage.getItem("printer_settings");
      
      const printerSettings = savedSettings ? JSON.parse(savedSettings) : null;

      const res = await axiosInstance.post(API_PATHS.printAdisyon, {
        printerId: printerSettings?.printer?._id || printerSettings?.id,
        title,
        orderId: selectedOrderId,
      });

      if (res.data?.status) {
        toast.success("Adisyon yazdırma işlemi başarılı.",successStyle);
      } else {
        toast.error(
          res.data?.message || "Adisyon yazdırılamadı.",
          warningStyle
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Yazdırma işlemi sırasında bir hata oluştu.",
        warningStyle
      );
    }
  };
  // Sepete Ürün Ekle
  const handleAddToCart = (food: Food) => {
    if (!selectedTable) {
      toast.warning("Lütfen önce bir masa seçiniz.", warningStyle);
      return;
    }
    setBasket((prev) => {
      const existing = prev.find((item) => String(item._id) === String(food._id));
      if (existing) {
        return prev.map((item) =>
          String(item._id) === String(food._id)
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: food._id,
          name: food.name,
          price: food.price,
          qty: 1,
          imgs: food.imgs,
        },
      ];
    });
  };

  // Sepette Adet Güncelle (+ / -)
  const handleUpdateQuantity = (foodId: string | number, delta: number) => {
    setBasket((prev) =>
      prev
        .map((item) => {
          if (String(item._id) === String(foodId)) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is BasketItem => item !== null)
    );
  };
  const saveOrder = async (shouldPrint = false) => {
    if (!selectedTable) return;

    setIsSubmitting(true);

    try {
      const hasOriginal = originalBasket && originalBasket.length > 0;
      let orderId=null
      if (!hasOriginal) {
        let res=await axiosInstance.post<ApiResponse<CreateOrder>>(API_PATHS.createOrder, {
          tableId: selectedTable._id,
          basket,
          total: totalAmount,
        });
        orderId=res.data.data.order._id

      } else {
        let res=await axiosInstance.put<ApiResponse<EditOrder>>(API_PATHS.editOrder, {
          tableId: selectedTable._id,
          basket,
          total: totalAmount,
          orderId: selectedTable.currentOrderId,
        });
        orderId=res.data.data._id
      }
      toast.success(`${selectedTable.name} siparişi kaydedildi`, successStyle);

      if (shouldPrint) {
        await handlePrinter("Yeni sipariş geldi", orderId || "1");
      }

      getTables();
      setOriginalBasket(basket);
      setSelectedTable(null);
      setPrintAlert(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Sipariş kaydedilirken bir hata oluştu.",
        warningStyle
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // Siparişi Sıfırla / İptal Et
  const handleClearBasket = () => {
    setBasket(originalBasket);
    toast.info("Değişiklikler sıfırlandı.");
  };

  // Onayla 
  const handleConfirm = async () => {
    if (!selectedTable) return;

    if (basket.length === 0) {
      toast.warning("Sepet boş, lütfen ürün ekleyiniz.", warningStyle);
      return;
    }

    let printerSettings = null;

    try {
      const savedSettings = localStorage.getItem("printer_settings");
      printerSettings = savedSettings ? JSON.parse(savedSettings) : null;
    } catch {
      printerSettings = null;
    }

    if (printerSettings?.behavior === "ask_every_order") {
      setPrintAlert(true);
      return;
    }

    await saveOrder(printerSettings?.behavior === "print_every_order");
  };

  // Ödeme Al
  const handleTakePayment = async () => {
    if (!selectedTable) return;
    if (basket.length === 0 && selectedTable.status === "bos") {
      toast.warning("Ödenecek aktif bir hesap bulunmuyor.", warningStyle);
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedTable.currentOrderId) {
        const res = await axiosInstance.post<ApiResponse>(API_PATHS.paidOrder, {
          tableId: selectedTable._id,
          basket,
          total: totalAmount,
          orderId: selectedTable.currentOrderId,
        });
        if (res.data.status) {
          toast.success(`${selectedTable.name} ödemesi başarıyla alındı!`, successStyle);
          getTables();
          setSelectedTable(null);
          setBasket([]);
          setOriginalBasket([]);
          setMobileOpen(false);
        } else {
          toast.warning(res.data.message || "Ödeme işlemi gerçekleştirilemedi.", warningStyle);
        }
      } else {
        toast.warning("Önce siparişi onaylamalısınız.", warningStyle);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Ödeme alınırken hata oluştu.", warningStyle);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Siparişi Sil
  const handleDeleteOrder = async () => {
    if (!selectedTable?.currentOrderId) {
      setBasket([]);
      toast.info("Sepet temizlendi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.delete<ApiResponse>(
        API_PATHS.deleteOrder(selectedTable.currentOrderId),
        {
          data: { orderId: selectedTable.currentOrderId },
        }
      );
      if (res.data.status) {
        toast.success("Sipariş tamamen silindi.", successStyle);
        getTables();
        setBasket([]);
        setOriginalBasket([]);
        setSelectedTable(null);
        //setMobileOpen(false);
        setSelectedTable(null)
      } else {
        toast.warning(res.data.message || "İstek hatası", warningStyle);
      }
    } catch {
      toast.error("Sipariş silinirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // İnce ve Şık Scrollbar Sınıfları (Dark & Light Uyumlu)
  const scrollbarClasses =
    "[scrollbar-width:thin] [scrollbar-color:#cbd7d0_transparent] dark:[scrollbar-color:#3f4d45_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#cbd7d0] dark:[&::-webkit-scrollbar-thumb]:bg-[#3f4d45] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent";

  return (
    <div className="relative w-full h-[calc(100vh-50px)] max-h-[calc(100vh-50px)] overflow-hidden bg-[#f7f9f7] dark:bg-background p-3 sm:p-4 select-none transition-colors duration-200">
      {/* 3 Kolonlu Masaüstü Grid (Masaüstü: Menü | Salon | Sepet; Mobilde: Sadece Salon) */}
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-4 h-full min-h-0">

        {/* ========================================================= */}
        {/* 1. SOL KOLON (MENÜ PANELİ) - Mobilde Gizli (hidden md:flex) */}
        {/* ========================================================= */}
        <section
          className={`hidden md:flex flex-col min-h-0 h-full rounded-[12px] bg-white dark:bg-card border
             border-[#e4e9e5] dark:border-border p-3.5 shadow-xs transition-opacity duration-200
              `
          }
        >
          {/* Üst Başlık & Ürün Sayısı Rozeti */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider text-[#98a29d] dark:text-muted-foreground uppercase">
                Menü Paneli
              </span>
              <h2 className="text-base font-bold text-[#1d2a24] dark:text-foreground leading-tight">
                {selectedTable ? `${selectedTable.name} Siparişi` : "Masa Seçilmedi"}
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-[#255f4b] dark:text-emerald-400 bg-[#e8f2ed] dark:bg-emerald-950/60 border border-transparent dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full">
              {filteredFoods.length} ürün
            </span>
          </div>

          {/* Filtre Alanı: Arama Kutusu ve Kategori Çipleri */}
          <div className="flex flex-col gap-2.5 mb-3 shrink-0">
            {/* Arama Kutusu */}
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3 text-[#78847e] dark:text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Yemek, içecek ara..."
                disabled={!selectedTable}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#f7f9f7] dark:bg-muted/30 border border-[#e4e9e5] dark:border-border text-xs text-[#1d2a24] dark:text-foreground placeholder:text-[#9aa49f] dark:placeholder:text-muted-foreground outline-none focus:border-[#255f4b] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-card transition-all disabled:opacity-50"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 text-[#9aa49f] dark:text-muted-foreground hover:text-[#1d2a24] dark:hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Yatay Kaydırmalı Kategori Çipleri */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setSelectedCategory("all")}
                disabled={!selectedTable}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selectedCategory === "all"
                  ? "bg-[#255f4b] dark:bg-emerald-600 text-white border-[#255f4b] dark:border-emerald-600 shadow-xs"
                  : "bg-white dark:bg-card text-[#78847e] dark:text-muted-foreground border-[#e4e9e5] dark:border-border hover:bg-[#e8f2ed] dark:hover:bg-muted/50 hover:text-[#255f4b] dark:hover:text-emerald-400"
                  }`}
              >
                Tümü
              </button>
              {categories.map((c) => {
                const isSelected = String(selectedCategory) === String(c._id);
                return (
                  <button
                    key={c._id}
                    onClick={() => setSelectedCategory(String(c._id))}
                    disabled={!selectedTable}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isSelected
                      ? "bg-[#255f4b] dark:bg-emerald-600 text-white border-[#255f4b] dark:border-emerald-600 shadow-xs"
                      : "bg-white dark:bg-card text-[#78847e] dark:text-muted-foreground border-[#e4e9e5] dark:border-border hover:bg-[#e8f2ed] dark:hover:bg-muted/50 hover:text-[#255f4b] dark:hover:text-emerald-400"
                      }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2 Kolonlu Ürün Grid'i - YALNIZCA KENDİ İÇİNDE KAYAR */}
          <div className={`flex-1 min-h-0 overflow-y-auto pr-1 ${scrollbarClasses}`}>
            {foodsLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#78847e] dark:text-muted-foreground">
                <Loader2 size={24} className="animate-spin mb-2 text-[#255f4b] dark:text-emerald-400" />
                <p className="text-xs">Ürünler yükleniyor...</p>
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#78847e] dark:text-muted-foreground">
                <Coffee size={28} className="text-[#9aa49f] dark:text-muted-foreground mb-2" />
                <p className="text-xs font-medium">Aradığınız kriterde ürün bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pb-2">
                {filteredFoods.map((food) => {
                  const inBasket = basket.find((b) => String(b._id) === String(food._id));
                  const imgPath =
                    food.imgs && Array.isArray(food.imgs) && food.imgs.length > 0
                      ? food.imgs[0]
                      : typeof food.imgs === "string"
                        ? food.imgs
                        : null;
                  const imgUrl = imgPath ? `${API_BASE_URL}${imgPath}` : null;

                  return (
                    <div
                      key={food._id}
                      className="group flex flex-col justify-between bg-white dark:bg-card border border-[#e4e9e5] dark:border-border rounded-[12px] p-2.5 hover:shadow-md hover:border-[#255f4b]/40 dark:hover:border-emerald-500/40 transition-all duration-200"
                    >
                      {/* Ürün Görseli: Masaüstünde şık yerleşim, mobilde tamamen gizli */}
                      <div className="hidden md:block w-full h-24 rounded-lg overflow-hidden bg-muted/30 dark:bg-muted/20 relative mb-2 group-hover:opacity-95 transition-opacity shrink-0">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={food.name}
                            className="w-full  h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Resim yüklenemezse ikon göster
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#e8f2ed] dark:bg-emerald-950/40 text-[#255f4b] dark:text-emerald-400">
                            <Utensils size={22} className="opacity-60" />
                          </div>
                        )}
                        {inBasket && (
                          <span className="absolute top-1.5 right-1.5 text-[10px] font-bold bg-[#255f4b] dark:bg-emerald-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                            {inBasket.qty}x
                          </span>
                        )}
                      </div>

                      <div className="mb-2">
                        <h4 className="font-semibold text-xs text-[#1d2a24] dark:text-foreground line-clamp-1 leading-tight group-hover:text-[#255f4b] dark:group-hover:text-emerald-400 transition-colors">
                          {food.name}
                        </h4>
                        <span className="text-[10px] text-[#78847e] dark:text-muted-foreground line-clamp-1">
                          {food.description || "Açıklama bulunmuyor"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#f0f3f1] dark:border-border/60 mt-auto">
                        <span className="text-xs font-extrabold text-[#255f4b] dark:text-emerald-400">
                          {food.price} ₺
                        </span>
                        {selectedTable &&
                          <button
                            onClick={() => handleAddToCart(food)}
                            disabled={!selectedTable}
                            aria-label={`${food.name} ekle`}
                            className="w-7 h-7 rounded-lg bg-[#255f4b] dark:bg-emerald-600 hover:bg-[#1e4e3d] dark:hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                          >
                            <Plus size={15} />
                          </button>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. ORTA KOLON (SALON / MASA PANELİ) - Masaüstü & Mobil   */}
        {/* ========================================================= */}
        {!selectedTable ? (
          <section className="flex flex-col min-h-0 h-full rounded-[12px] bg-white dark:bg-card border border-[#e4e9e5] dark:border-border p-3.5 shadow-xs">
            {/* Üst Başlık & Renk Lejantı */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider text-[#98a29d] dark:text-muted-foreground uppercase">
                  Salon Düzeni
                </span>
                <h2 className="text-base font-bold text-[#1d2a24] dark:text-foreground leading-tight">
                  Masalar ({tables.length})
                </h2>
              </div>

              {/* Boş / Dolu Lejantı */}
              <div className="flex items-center gap-2.5 text-[10px] font-semibold text-[#78847e] dark:text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-white dark:bg-card border border-[#cbd7d0] dark:border-border inline-block" />
                  <span>Boş</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#d9eaff] dark:bg-sky-950/70 border border-[#c1dcef] dark:border-sky-800 inline-block" />
                  <span className="text-[#316da7] dark:text-sky-300">Dolu</span>
                </div>
              </div>
            </div>

            {/* 3 Kolonlu Masa Grid'i - YALNIZCA KENDİ İÇİNDE KAYAR */}
            <div className={`flex-1 min-h-0 overflow-y-auto pr-1 ${scrollbarClasses}`}>
              {tablesLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#78847e] dark:text-muted-foreground">
                  <Loader2 size={24} className="animate-spin mb-2 text-[#255f4b] dark:text-emerald-400" />
                  <p className="text-xs">Masalar yükleniyor...</p>
                </div>
              ) : tables.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#78847e] dark:text-muted-foreground">
                  <p className="text-xs font-medium">Masa kaydı bulunamadı.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 pb-2">
                  {tables.map((table, index) => {
                    // const isSelected = selectedTable?._id === table._id;
                    const isOccupied = table.status === "dolu";

                    // Boş, Dolu, Seçili stil mantığı (Dark & Light uyumlu)
                    let cardStyle =
                      "bg-white dark:bg-card border-[#e4e9e5] dark:border-border text-[#1d2a24] dark:text-foreground hover:border-[#255f4b]/50 dark:hover:border-emerald-500/50";
                    let badgeStyle =
                      "border-[#cbd7d0] dark:border-border bg-[#f7f9f7] dark:bg-muted/30 text-[#6b8174] dark:text-muted-foreground";

                    if (isOccupied) {
                      cardStyle =
                        "bg-[#d9eaff] dark:bg-sky-950/60 border-[#c1dcef] dark:border-sky-800 text-[#316da7] dark:text-sky-300";
                      badgeStyle =
                        "border-[#c1dcef] dark:border-sky-700 bg-white/70 dark:bg-sky-900/40 text-[#316da7] dark:text-sky-300";
                    }

                    // if (isSelected) {
                    //   cardStyle =
                    //     "ring-2 ring-[#255f4b] dark:ring-emerald-500 border-[#255f4b] dark:border-emerald-500 shadow-md bg-white dark:bg-card";
                    // }

                    return (
                      <button
                        key={table._id}
                        onClick={() => handleSelectTable(table)}
                        className={`relative min-h-[88px] sm:min-h-[96px] rounded-[12px] border p-2 flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer ${cardStyle}`}
                      >
                        {/* Masa Numarası Rozeti */}
                        <div
                          className={`w-9 h-7 rounded-md border flex items-center justify-center text-xs font-bold ${badgeStyle}`}
                        >
                          {(index + 1).toString().padStart(2, "0")}
                        </div>

                        <strong className="text-xs font-semibold leading-tight line-clamp-1">
                          {table.name}
                        </strong>

                        <span className="text-[10px] text-[#78847e] dark:text-muted-foreground font-medium">
                          {isOccupied ? "Dolu Masa" : "Boş Masa"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="hidden md:flex flex-col min-h-0 h-full rounded-[12px] bg-white dark:bg-card border border-[#e4e9e5] dark:border-border p-3.5 shadow-xs">

            {/* Üst Seçili Masa Başlığı */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3f1] dark:border-border/60 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setSelectedTable(null) }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#f0f3f1] dark:border-border/60 hover:bg-[#f0f3f1] dark:hover:bg-muted transition-colors"
                  aria-label="Geri"
                >
                  <ArrowLeft size={18} />
                </button>

                <div>
                  <span className="text-[10px] font-extrabold tracking-wider text-[#98a29d] dark:text-muted-foreground uppercase">
                    Aktif Sipariş
                  </span>
                  <h2 className="text-base font-bold text-[#1d2a24] dark:text-foreground leading-tight">
                    {selectedTable ? selectedTable.name : "Masa Seçilmedi"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedTable.currentOrderId &&  localStorage.getItem("printer_settings") && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Printer
                          size={20}
                          className="hidden sm:block cursor-pointer text-gray-500 dark:text-gray-400"
                          onClick={() => {
                            handlePrinter("Test Fişi", selectedTable.currentOrderId)
                          }}
                        />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>
                          {printers?.length > 0
                            ? printers.find(
                              (printer) =>
                                String(printer._id) ===
                                String(JSON.parse(localStorage.getItem("printer_settings") || "{}").printer?._id)
                            )?.name || "Yazıcı"
                            : "Yazıcı bulunamadı"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedTable.status === "dolu"
                    ? "bg-[#d9eaff] dark:bg-sky-950/60 text-[#316da7] dark:text-sky-300"
                    : "bg-[#e8f2ed] dark:bg-emerald-950/60 text-[#255f4b] dark:text-emerald-400 border border-transparent dark:border-emerald-800/40"
                    }`}
                >
                  {selectedTable.status === "dolu" ? "Dolu Masa" : "Boş Masa"}
                </span>


              </div>

            </div>


            {/* Sepet Ürün Listesi - YALNIZCA KENDİ İÇİNDE KAYAR */}
            <div className={`flex-1 min-h-0 overflow-y-auto pr-1 my-2.5 ${scrollbarClasses}`}>
              {basket.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#78847e] dark:text-muted-foreground">
                  <div className="w-11 h-11 rounded-full bg-[#f1f5f2] dark:bg-muted/40 text-[#9aa49f] dark:text-muted-foreground flex items-center justify-center mb-2">
                    <Coffee size={22} />
                  </div>
                  <strong className="text-xs font-semibold text-[#1d2a24] dark:text-foreground">
                    {selectedTable ? "Sepetiniz Boş" : "Lütfen Masa Seçin"}
                  </strong>
                  <p className="text-[11px] text-[#9aa49f] dark:text-muted-foreground mt-1 max-w-[160px]">
                    Menüden ürün ekleyerek siparişi oluşturun.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[#f0f3f1] dark:divide-border/60">
                  {basket.map((item) => (
                    <div
                      key={item._id}
                      className="py-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-[#1d2a24] dark:text-foreground truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-[#78847e] dark:text-muted-foreground">
                          {item.price} ₺ × {item.qty} ={" "}
                          <strong className="text-[#255f4b] dark:text-emerald-400 font-bold">
                            {item.price * item.qty} ₺
                          </strong>
                        </span>
                      </div>

                      {/* Adet Artır / Azalt Butonları */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-[#f7f9f7] dark:bg-muted/40 border border-[#e4e9e5] dark:border-border rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, -1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-card hover:bg-[#e8f2ed] dark:hover:bg-muted text-[#1d2a24] dark:text-foreground flex items-center justify-center text-xs font-bold transition-colors active:scale-95 border border-[#e4e9e5] dark:border-border cursor-pointer"
                          aria-label="Azalt"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#1d2a24] dark:text-foreground">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, 1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-card hover:bg-[#e8f2ed] dark:hover:bg-muted text-[#1d2a24] dark:text-foreground flex items-center justify-center text-xs font-bold transition-colors active:scale-95 border border-[#e4e9e5] dark:border-border cursor-pointer"
                          aria-label="Artır"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alt Sabit Bölüm: Toplam Tutar ve İşlem Butonları */}
            <div className="pt-3 border-t border-[#f0f3f1] dark:border-border/60 flex flex-col gap-2 shrink-0">
              {/* Toplam Tutar Satırı */}
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-[#78847e] dark:text-muted-foreground font-semibold">
                  Toplam Tutar ({totalItemCount} ürün)
                </span>
                <strong className="text-lg font-black text-[#1d2a24] dark:text-foreground tracking-tight">
                  {totalAmount} ₺
                </strong>
              </div>

              {/* İşlem Butonları ("Siparişi Sil" & "Onayla & Yazdır") */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDeleteOrder}
                  disabled={!selectedTable || isSubmitting}
                  className="h-9 px-3 rounded-lg border border-[#e4e9e5] dark:border-border bg-white dark:bg-card hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800 text-[#78847e] dark:text-muted-foreground text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Siparişi Sil</span>
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedTable || basket.length === 0 || isSubmitting}
                  className="h-9 px-3 rounded-lg bg-[#255f4b] dark:bg-emerald-600 hover:bg-[#1e4e3d] dark:hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Printer size={14} />
                  )}
                  <span>Onayla </span>
                </button>
              </div>

              {/* Ödeme Al Butonu */}
              <button
                onClick={handleTakePayment}
                disabled={
                  !selectedTable ||
                  isSubmitting ||
                  (basket.length === 0 && selectedTable.status === "bos")
                }
                className="w-full h-9 rounded-lg bg-[#e8f2ed] dark:bg-emerald-950/60 hover:bg-[#d6e7de] dark:hover:bg-emerald-900/60 text-[#255f4b] dark:text-emerald-300 border border-[#c9ddd2] dark:border-emerald-800/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <CreditCard size={15} />
                <span>Ödeme Al</span>
              </button>
            </div>
          </section>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. MOBİL AÇILIR PENCERE (BOTTOM SHEET / MODAL DRAWER)      */}
      {/* ========================================================= */}
      {mobileOpen && selectedTable && (
        <div
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-[2px] flex items-end justify-center md:hidden p-0 animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full max-h-[92vh] bg-[#f7f9f7] dark:bg-card rounded-t-2xl border-t border-[#e4e9e5] dark:border-border p-4 flex flex-col min-h-0 shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Modal Başlığı ve Kapat Butonu */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e9e5] dark:border-border shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#255f4b] dark:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {selectedTable.name.replace(/[^0-9]/g, "") || "M"}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#1d2a24] dark:text-foreground leading-tight">
                    {selectedTable.name}
                  </h3>
                  <span className="text-[10px] text-[#78847e] dark:text-muted-foreground">
                    Durum: {selectedTable.status === "dolu" ? "Dolu Masa" : "Boş Masa"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="w-8 h-8 rounded-full bg-white dark:bg-muted/40 border border-[#e4e9e5] dark:border-border text-[#78847e] dark:text-muted-foreground hover:text-[#1d2a24] dark:hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2. Hızlı Ürün Listesi (Maksimum 190px içten kaydırmalı, MOBİLDE RESİM YOK) */}
            <div className="mt-3 shrink-0">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[11px] font-bold text-[#1d2a24] dark:text-foreground">
                  Hızlı Menü Seçimi
                </span>
                <span className="text-[10px] text-[#78847e] dark:text-muted-foreground">
                  {filteredFoods.length} ürün
                </span>
              </div>
              <div
                className={`max-h-[190px] overflow-y-auto bg-white dark:bg-muted/20 border border-[#e4e9e5] dark:border-border rounded-[12px] divide-y divide-[#f0f3f1] dark:divide-border/50 ${scrollbarClasses}`}
              >
                {filteredFoods.map((food) => (
                  <button
                    key={food._id}
                    onClick={() => handleAddToCart(food)}
                    className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-[#f7f9f7] dark:hover:bg-muted/40 active:bg-[#e8f2ed] dark:active:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-semibold text-[#1d2a24] dark:text-foreground block truncate">
                        {food.name}
                      </span>
                      <span className="text-[10px] text-[#78847e] dark:text-muted-foreground">
                        {food.price} ₺
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-6 h-6 rounded-md bg-[#255f4b] dark:bg-emerald-600 text-white flex items-center justify-center">
                        <Plus size={14} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Mobil Sepet Listesi (Maksimum 125px içten kaydırmalı) */}
            <div className="mt-3 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[11px] font-bold text-[#1d2a24] dark:text-foreground">
                  Sipariş Sepeti ({totalItemCount} ürün)
                </span>
                <strong className="text-xs font-extrabold text-[#255f4b] dark:text-emerald-400">
                  {totalAmount} ₺
                </strong>
              </div>

              <div
                className={`max-h-[125px] overflow-y-auto bg-white dark:bg-muted/20 border border-[#e4e9e5] dark:border-border rounded-[12px] divide-y divide-[#f0f3f1] dark:divide-border/50 ${scrollbarClasses}`}
              >
                {basket.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-[#9aa49f] dark:text-muted-foreground">
                    Sepete henüz ürün eklenmedi.
                  </div>
                ) : (
                  basket.map((item) => (
                    <div
                      key={item._id}
                      className="px-3 py-2 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-[#1d2a24] dark:text-foreground block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#78847e] dark:text-muted-foreground">
                          {item.price * item.qty} ₺
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-[#f7f9f7] dark:bg-muted/40 border border-[#e4e9e5] dark:border-border rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, -1)}
                          className="w-5 h-5 rounded bg-white dark:bg-card text-[#1d2a24] dark:text-foreground flex items-center justify-center text-xs font-bold border border-[#e4e9e5] dark:border-border cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <b className="w-5 text-center text-xs text-[#1d2a24] dark:text-foreground">
                          {item.qty}
                        </b>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, 1)}
                          className="w-5 h-5 rounded bg-white dark:bg-card text-[#1d2a24] dark:text-foreground flex items-center justify-center text-xs font-bold border border-[#e4e9e5] dark:border-border cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4. En Altta Onayla & Yazdır ve Ödeme Al Butonları */}
            <div className="pt-3 mt-auto shrink-0 flex gap-2">
              <button
                onClick={handleConfirm}
                disabled={basket.length === 0 || isSubmitting}
                className="flex-1 h-11 rounded-xl bg-[#255f4b] dark:bg-emerald-600 hover:bg-[#1e4e3d] dark:hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Printer size={16} />
                )}
                <span>Onayla ({totalAmount} ₺)</span>
              </button>

              <button
                onClick={handleTakePayment}
                disabled={
                  (basket.length === 0 && selectedTable.status === "bos") ||
                  isSubmitting
                }
                className="px-3.5 h-11 rounded-xl bg-[#e8f2ed] dark:bg-emerald-950/60 text-[#255f4b] dark:text-emerald-300 border border-[#c9ddd2] dark:border-emerald-800/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Ödeme Al"
              >
                <CreditCard size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomAlertDialog open={printAlert} onOpenChange={setPrintAlert}
        title={
          <p >
            <span className="text-destructive">
              {JSON.parse(localStorage.getItem("printer_settings") || "{}").printer?.name || "Yazıcı seçilmedi"}
            </span>          </p>
        }
        description="Bu işlem geri alınamaz."
        onConfirm={() => saveOrder(true)}
      />
    </div>
  );
}