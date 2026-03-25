"use client";

import { useEffect, useState } from "react";
import { useGetFoods } from "@/hooks/useGetFoods";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import CreateFoodForm from "./components/CreateFoodForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

import EditFoodForm from "./components/EditFoodForm";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useGetCategory } from "@/hooks/useGetCategory";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  UtensilsCrossed,
  Pencil,
  Trash2
} from "lucide-react";
import CustomAlertDialog from "@/pages/Dashboard/components/CustomAlertDialog";
import { Food } from "@/models/Food";
export default function AdminFoods() {
  const [showEdit, setShowEdit] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food>();
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { getFoods, foods } = useGetFoods();
  const { categories, getCategories } = useGetCategory();
  useEffect(() => {
    getFoods();
    getCategories()
  }, []);

  const handleDelete = async () => {
    if (!selectedFood) return;
    try {
      const { data } = await axiosInstance.delete(API_PATHS.deleteFood(String(selectedFood._id)));
      if (data.success) {
        getFoods();
        toast.success("Yemek silindi", successStyle);
      }
    } catch (err: any) {
      toast.warning(err.message || "Hata", warningStyle);
    } finally {
      setShowDelete(false);
      setSelectedFood(undefined);
    }
  };
  const onUpdate = () => {

    getFoods()
  };
  const filteredFoods = foods.filter(f => {
    const matchCategory = filterCategory === "all" || f.categoryId === filterCategory;
    const matchSearch =
      f.name.toLowerCase().includes(search) ||
      f.description.toLowerCase().includes(search) ||
      f.price.toString().includes(search);
    return matchCategory && matchSearch;
  });
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">

      {/* Üst Kısım: Başlık ve Ekle Butonu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-primary" />
            Yemek Menüsü
          </h1>
          <p className="text-muted-foreground mt-1">Sistemdeki tüm yemekleri yönetin ve yeni eklemeler yapın.</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> Yemek Ekle
        </Button>
      </div>

      {/* Filtreleme ve Arama Çubuğu */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/40 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Yemek ismi ara..."
            className="pl-10 bg-background/50 border-border/50 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-60">
          <Select onValueChange={(val) => setFilterCategory(val)} defaultValue="all">
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="Kategori seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map(c => (
                <SelectItem key={c._id} value={String(c._id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Yemek Listesi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFoods.map((food) => {
          const hasTwoImages = food.imgs.length > 1;
          const categoryName = categories.find(i => i._id === (food.categoryId))?.name;

          return (
            <Card key={food._id} className="group overflow-hidden border-none shadow-xl bg-card/60 backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              {/* Görsel Alanı */}
              <div
                className="relative aspect-video overflow-hidden cursor-pointer"
                onMouseMove={(e: any) => {
                  if (!hasTwoImages) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const img = e.currentTarget.querySelector("img");
                  img.src = x < rect.width / 2
                    ? `http://localhost:5000${food.imgs[0]}`
                    : `http://localhost:5000${food.imgs[1]}`;
                }}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
                  {/* aspect-video zaten 16:9 oranını sağlar (Tailwind) */}
                  <img
                    src={`http://localhost:5000${food.imgs[0]}`}
                    alt={food.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  // object-cover: Resmi çerçeveye yayar, taşan kısımları kırpar.
                  />
                </div>

                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-md border-none">
                    {food.price} ₺
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold line-clamp-1">{food.name}</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit text-[10px] uppercase tracking-wider text-primary border-primary/30">
                  {categoryName || "Kategori Yok"}
                </Badge>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                  {food.description || "Bu yemek için açıklama girilmemiş."}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-background/50 hover:bg-primary hover:text-white transition-colors border-border/50"
                  onClick={() => { setSelectedFood(food); setShowEdit(true); }}
                >
                  <Pencil className="w-3 h-3 mr-2" /> Düzenle
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 opacity-80 hover:opacity-100"
                  onClick={() => { setSelectedFood(food); setShowDelete(true); }}
                >
                  <Trash2 className="w-3 h-3 mr-2" /> Sil
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedFood && <EditFoodForm key={selectedFood._id} food={selectedFood} onUpdate={onUpdate} open={showEdit} setOpen={setShowEdit} />}


      {/* Create Dialog */}
      <CreateFoodForm open={showCreate} setOpen={setShowCreate} onUpdate={onUpdate} />


      {/* Delete AlertDialog */}
      <CustomAlertDialog open={showDelete} onOpenChange={setShowDelete}
        title={`${selectedFood?.name} adlı yemeği  silmek istediğine emin misin?`}
        description="Bu işlem geri alınamaz."

        onConfirm={handleDelete}
      />


    </div>
  );
}
