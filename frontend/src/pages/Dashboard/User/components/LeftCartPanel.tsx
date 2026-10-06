import { useState, useMemo, useEffect } from "react";
import { AllTable } from "@/models/Tables";
import { BasketItem } from "../UserOverview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowLeft, Trash2, CheckCircle, CreditCard, Printer, CalendarCheck, CalendarX } from "lucide-react";
import TableCard from "./TableCard";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import useAuthStore from "@/store/useAuthStore";
import CustomAlertDialog from "@/pages/Dashboard/components/CustomAlertDialog";
import { useGetRezerve } from "@/hooks/useGetRezerve";
import { useGetPrinter } from "@/hooks/useGetPrinter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import RezerveDialog from "./RezerveDialog";

interface LeftCartPanelProps {
    tables: AllTable[];
    selectedTable: AllTable | null;
    setSelectedTable: (table: AllTable | null) => void;
    basket: BasketItem[];
    setBasket: (basket: BasketItem[]) => void;
    originalBasket: BasketItem[];
    setOriginalBasket: (basket: BasketItem[]) => void;
    onSuccess: () => void;
    resetSelection: () => void;
}

export default function LeftCartPanel({
    tables,
    selectedTable,
    setSelectedTable,
    basket,
    setBasket,
    originalBasket,
    setOriginalBasket,
    onSuccess,
    resetSelection
}: LeftCartPanelProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "dolu" | "bos" | "rezerve">("all");
    const { rezerve, getRezerve } = useGetRezerve();
    const { printers, getPrinters } = useGetPrinter();
    const user = useAuthStore((state) => state.user);

    const [deleteAlert, setDeleteAlert] = useState(false);
    const [showRezerveDialog, setShowRezerveDialog] = useState(false);

    useEffect(() => {
        getRezerve();
        getPrinters();
    }, []);

    // Fetch Table details when selected (adisyon data)
    useEffect(() => {
        const fetchTable = async (id: string) => {
            const res = await axiosInstance.get(API_PATHS.getTable(id));
            if (res.data.status) {
                const adisyon = res.data.data?.adisyon?.map((i: any) => ({
                    _id: i.foodId,
                    name: i.name,
                    price: i.price,
                    qty: i.qty
                })) || [];
                setBasket(adisyon);
                setOriginalBasket(adisyon);
            } else {
                toast.error(res.data.message || "Masa bilgisi alınamadı", warningStyle);
            }
        };

        if (selectedTable?._id) {
            fetchTable(selectedTable._id);
        }
    }, [selectedTable?._id]);

    const filteredTables = useMemo(() => {
        return tables.filter((t) => {
            const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "all" ? true : t.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [tables, search, statusFilter]);

    const totalAmount = useMemo(
        () => basket.reduce((sum, f) => sum + f.price * f.qty, 0),
        [basket]
    );

    const confirmBasket = async () => {
        if (!selectedTable) return;
        const changed = JSON.stringify(basket) !== JSON.stringify(originalBasket);
        const hasOriginal = originalBasket && originalBasket.length > 0;
        const isBasketEmpty = basket.length === 0;

        if (!hasOriginal) {
            if (isBasketEmpty) {
                toast.error("Sepet boş, sipariş oluşturulamaz.");
                return;
            }
            const res = await axiosInstance.post(API_PATHS.createOrder, { tableId: selectedTable._id, basket, total: totalAmount });
            if (res.data.status) {
                toast.success("Sipariş başarıyla kaydedildi", successStyle);
                onSuccess();
            } else {
                toast.warning(res.data.message, warningStyle);
            }
            return;
        }

        if (changed) {
            if (isBasketEmpty) {
                toast.error("Sipariş boş olamaz. En az bir ürün seçmelisiniz.");
                return;
            }
            const res = await axiosInstance.put(API_PATHS.editOrder, { tableId: selectedTable._id, basket, total: totalAmount, orderId: selectedTable.currentOrderId });
            if (res.data.status) {
                toast.success("Sipariş başarıyla güncellendi", successStyle);
                onSuccess();
            } else {
                toast.warning(res.data.message, warningStyle);
            }
        } else {
            toast.warning("Herhangi bir değişiklik yok", warningStyle);
        }
    };

    const deleteOrder = async () => {
        if (!selectedTable?.currentOrderId) {
            toast.warning("Önce sipariş oluşturmalısınız", warningStyle);
            return;
        }
        const res = await axiosInstance.delete(API_PATHS.deleteOrder(selectedTable.currentOrderId), {
            data: { orderId: selectedTable.currentOrderId }
        });
        if (res.data.status) {
            toast.success("Sipariş tamamen silindi", successStyle);
            onSuccess();
            setDeleteAlert(false);
        } else {
            toast.warning(res.data.message || "İstek hatası", warningStyle);
        }
    };

    const odemeAl = async () => {
        if (!selectedTable) return;
        const isBasketEmpty = basket.length === 0;
        if (isBasketEmpty) {
            toast.error("Sipariş boş olamaz. En az bir ürün seçmelisiniz.");
            return;
        }
        if (selectedTable.currentOrderId) {
            const res = await axiosInstance.post(API_PATHS.paidOrder, { tableId: selectedTable._id, basket, total: totalAmount, orderId: selectedTable.currentOrderId });
            if (res.data.status) {
                toast.success("Ödeme başarıyla alındı", successStyle);
                onSuccess();
            } else {
                toast.warning(res.data.message, warningStyle);
            }
        } else {
            toast.warning("Önce siparişi onaylamalısınız", warningStyle);
        }
    };

    const handlePrint = async (printerId: number) => {
        if (!selectedTable?.currentOrderId) return;
        try {
            const response = await axiosInstance.post(API_PATHS.printAdisyon, {
                printerId,
                orderId: selectedTable.currentOrderId
            });
            if (response.data.status) {
                toast.success("Sipariş yazdırılıyor...", successStyle);
            } else {
                toast.warning(response.data.message || "Yazdırma hatası", warningStyle);
            }
        } catch (error) {
            console.error("Yazdırma hatası:", error);
        }
    };

    const removeFood = (foodId: string) => {
        const existing = basket.find(b => String(b._id) === foodId);
        if (!existing) return;
        if (existing.qty === 1) setBasket(basket.filter(b => String(b._id) !== foodId));
        else setBasket(basket.map(b => String(b._id) === foodId ? { ...b, qty: b.qty - 1 } : b));
    };

    const increaseFood = (foodId: string) => {
        setBasket(basket.map(b => String(b._id) === foodId ? { ...b, qty: b.qty + 1 } : b));
    };

    // Masa Secilmedi ise 
    if (!selectedTable) {
        return (
            <div className="flex flex-col h-full w-full">
                <div className="p-4 border-b space-y-3 shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Masalar <span className="text-sm font-normal text-muted-foreground ml-auto">({tables.length})</span>
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Masa ara..."
                                className="pl-9 h-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                            <SelectTrigger className="w-[110px] h-9">
                                <SelectValue placeholder="Durum" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tümü</SelectItem>
                                <SelectItem value="dolu">Dolu</SelectItem>
                                {/* <SelectItem value="rezerve">Rzv</SelectItem> */}
                                <SelectItem value="bos">Boş</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-3 pb-20">
                        {filteredTables.map((t) => (
                            <TableCard
                                rezerve={rezerve}
                                key={t._id}
                                table={t}
                                onClick={() => setSelectedTable(t)}
                            />
                        ))}
                        {filteredTables.length === 0 && (
                            <div className="col-span-2 text-center text-muted-foreground py-10">Masa bulunamadı.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 2) TABLE SELECTED -> SHOW CART DETAILS
    return (
        <div className="flex flex-col  h-fit bg-background ">
            <div className="flex items-center justify-between p-4 border-b   bg-muted/10">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={resetSelection} className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-bold leading-tight">{selectedTable.name}</h2>
                        <span className="text-xs text-muted-foreground">Düzenleniyor</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {selectedTable.currentOrderId ? (
                        localStorage.getItem("selected_printer") ? (
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Yazdır" onClick={() => {
                                const savedId = localStorage.getItem("selected_printer");
                                handlePrint(Number(savedId));
                            }}>
                                <Printer className="h-4 w-4" />
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0"><Printer className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {printers.map((p) => (
                                        <DropdownMenuItem key={p._id} onClick={() => {
                                            localStorage.setItem("selected_printer", JSON.stringify(p));
                                            handlePrint(p._id);
                                        }}>
                                            {p.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    ) : (
                        <div></div>
                        // <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Rezerve" onClick={() => setShowRezerveDialog(true)}>
                        //     <CalendarCheck className="h-4 w-4" />
                        // </Button>
                    )}
                </div>
            </div>

            {/* Sipariş Listesi */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-muted/5">
                {!basket.length && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p>Sepet boş</p>
                        <span className="text-sm">Menüden ürün ekleyin.</span>
                    </div>
                )}
                {basket.map((item) => (
                    <div key={item._id} className="bg-background border rounded-xl p-3 flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm leading-tight">{item.name}</span>
                            <span className="font-bold text-sm shrink-0 ml-2">{item.price * item.qty} TL</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">{item.price} TL / adet</span>
                            <div className="flex items-center gap-1 bg-muted/50 rounded-md border p-0.5">
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={() => removeFood(String(item._id))}>-</Button>
                                <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded" onClick={() => increaseFood(String(item._id))}>+</Button>
                            </div>
                        </div>
                    </div>
                ))}
                
            </div>

            {/* Alt Kontroller */}
            <div className=" flex flex-col border-t bg-background px-3 py-2 gap-2 ">
                <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-medium text-muted-foreground">Genel Toplam</span>
                    <span className="text-2xl font-black text-primary">{totalAmount} TL</span>
                </div>

                <div className="grid grid-cols-2 gap-2 ">
                    <Button onClick={confirmBasket} className="h-12 w-full font-bold shadow-md hover:shadow-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" /> Siparişi Onayla
                    </Button>

                    {user?.role !== "Garson" ? (
                        <Button onClick={odemeAl} className="h-12 w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg flex items-center gap-2" disabled={!selectedTable.currentOrderId}>
                            <CreditCard className="h-5 w-5" /> Ödeme Al
                        </Button>
                    ) : (
                        <Button variant="outline" className="h-12 w-full font-bold" onClick={resetSelection}>
                            Kapat
                        </Button>
                    )}
                      <Button variant="outline" className="h-10 w-full text-foreground/80 font-medium" onClick={() => setBasket(originalBasket)}>
                        İptal Et
                    </Button>

                    {user?.role !== "Garson" ? (
                        <Button variant="ghost" className="h-10 w-full text-red-500 hover:bg-red-50 hover:text-red-600 tracking-wide text-sm font-semibold uppercase" onClick={() => setDeleteAlert(true)} disabled={!selectedTable.currentOrderId}>
                            <Trash2 className="h-4 w-4 mr-2" /> Siparişi Sil
                        </Button>
                    ) : (
                        <Button variant="ghost" className="h-10 w-full" onClick={resetSelection}>
                            Kapat
                        </Button>
                    )}
                </div>

            </div>

            <CustomAlertDialog
                open={deleteAlert}
                onOpenChange={setDeleteAlert}
                title="Sipariş silinsin mi?"
                description="Bu işlem geri alınamaz."
                confirmText="Evet, sil"
                cancelText="Vazgeç"
                onConfirm={deleteOrder}
            />
            <RezerveDialog
                setOpen={setShowRezerveDialog}
                showRezerveDialog={showRezerveDialog}
                setShowRezerveDialog={setShowRezerveDialog}
                masaId={selectedTable._id}
                onSuccess={resetSelection}
            />
        </div>
    );
}
