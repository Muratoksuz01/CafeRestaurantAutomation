import { useState, useEffect } from "react";
import { AllTable } from "@/models/Tables";
import { BasketItem } from "../UserOverview";
import { useGetFoods } from "@/hooks/useGetFoods";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { Search, Plus, Minus, Lock } from "lucide-react";
import { Food } from "@/models/Food";

interface RightMenuPanelProps {
    selectedTable: AllTable | null;
    basket: BasketItem[];
    setBasket: (basket: BasketItem[]) => void;
}

export default function RightMenuPanel({ selectedTable, basket, setBasket }: RightMenuPanelProps) {
    const { foods, getFoods } = useGetFoods();
    const { categories, getCategories } = useGetCategory();

    const [search, setSearch] = useState("");
    const [selectedCat, setSelectedCat] = useState("all");

    useEffect(() => {
        getFoods();
        getCategories();
    }, []);

    const filteredFoods = foods
        .filter(f => selectedCat === "all" ? true : f.categoryId === selectedCat)
        .filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    const addFood = (food: Food) => {
        const existing = basket.find(b => b._id === food._id);
        if (existing) {
            setBasket(basket.map(b => b._id === food._id ? { ...b, qty: b.qty + 1 } : b));
        } else {
            setBasket([...basket, { ...food, qty: 1 }]);
        }
    };

    const removeFood = (foodId: string) => {
        const existing = basket.find(b => String(b._id) === foodId);
        if (!existing) return;
        if (existing.qty === 1) {
            setBasket(basket.filter(b => String(b._id) !== foodId));
        } else {
            setBasket(basket.map(b => String(b._id) === foodId ? { ...b, qty: b.qty - 1 } : b));
        }
    };

    return (
        <div className="flex flex-col h-fit  bg-muted/20 relative">
            {/* ÜST BAR: Arama ve Kategori Filtresi */}
            {selectedTable && (
                <div className="p-4 bg-background border-b ">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Yemek, içecek ara..."
                                className="pl-9 bg-muted/50 border-none h-11 rounded-xl focus-visible:ring-primary/40"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar snap-x">
                            <Button
                                variant={selectedCat === "all" ? "default" : "outline"}
                                className={`rounded-full px-5 h-11 shrink-0 snap-center transition-all ${selectedCat === "all" ? "shadow-md" : ""}`}
                                onClick={() => setSelectedCat("all")}
                            >
                                Tümü
                            </Button>
                            {categories.map((c) => (
                                <Button
                                    key={c._id}
                                    variant={selectedCat === c._id ? "default" : "outline"}
                                    className={`rounded-full px-5 h-11 shrink-0 snap-center transition-all ${selectedCat === c._id ? "shadow-md" : ""}`}
                                    onClick={() => setSelectedCat(c._id)}
                                >
                                    {c.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* İÇERİK LİSTESİ - Dış kapsayıcı yüksekliği sınırlanıp kilitlendi */}
            <div className="flex-1  relative w-full h-full min-h-0">
                {!selectedTable ? (
                    <div className="absolute z-10 flex items-center justify-center bg-background/80 ">
                        <div className="flex flex-col items-center justify-center text-center p-4">
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-5 shadow-sm">
                                <Lock className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold">Masa Seçilmedi</h2>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                Sipariş oluşturmak için önce bir masa seçmelisiniz.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Yalnızca burası kaydırılabilir (Kaydırma alanı) */}
                        <div className="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredFoods.map((food) => {
                                    const basketItem = basket.find(b => b._id === food._id);

                                    return (
                                        <div
                                            key={food._id}
                                            className={`flex flex-col bg-background rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!selectedTable ? 'opacity-80' : ''}`}
                                        >
                                            <div className="h-36 sm:h-44 w-full bg-muted relative overflow-hidden group shrink-0">
                                                <img
                                                    src={food.imgs?.[0] ? `${API_BASE_URL}${food.imgs[0]}` : "/placeholder.png"}
                                                    alt={food.name}
                                                    className={`w-full h-full object-cover transition-transform duration-700 ${selectedTable ? 'group-hover:scale-110' : ''}`}
                                                />

                                                {!selectedTable && (
                                                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center">
                                                        <div className="bg-background/80 text-muted-foreground px-4 py-2 rounded-full border shadow-sm backdrop-blur-md flex items-center gap-2 text-sm font-medium">
                                                            <Lock className="h-4 w-4" /> Masa Seçin
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 sm:p-5 flex flex-col flex-1 gap-1">
                                                <h3 className="font-bold text-lg leading-tight capitalize min-h-[44px]">{food.name}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] opacity-80">{food.description || "Açıklama bulunmuyor."}</p>

                                                <div className="mt-auto pt-4 flex items-center justify-between">
                                                    <span className="text-xl font-black text-primary">{food.price} <span className="text-sm font-medium">TL</span></span>

                                                    <div className={`transition-opacity duration-300 ${selectedTable ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                                        {basketItem ? (
                                                            <div className="flex items-center gap-1 bg-muted rounded-lg border p-1 shadow-inner">
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-background shadow-sm" onClick={() => removeFood(String(food._id))}>
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="w-6 text-center font-bold">{basketItem.qty}</span>
                                                                <Button size="icon" variant="default" className="h-8 w-8 rounded-md shadow-sm" onClick={() => addFood(food)}>
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                className="rounded-xl px-5 shadow-md shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                                                                onClick={() => addFood(food)}
                                                            >
                                                                Ekle
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>

                            {filteredFoods.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-10">
                                    <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <Search className="h-10 w-10 opacity-50" />
                                    </div>
                                    <p className="text-lg font-medium">Sonuç bulunamadı</p>
                                    <p className="text-sm opacity-70 mt-1">Farklı bir arama yapın veya kategoriyi değiştirin.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
