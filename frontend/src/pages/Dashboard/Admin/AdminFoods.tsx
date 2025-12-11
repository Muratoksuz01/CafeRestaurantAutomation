"use client";

import { useEffect, useState } from "react";
import { useGetFoods } from "@/hooks/useGetFoods";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import CreateFoodForm from "./CreateFoodForm";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"

import EditFoodForm from "./EditFoodForm";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useGetCategory } from "@/hooks/useGetCategory";

export default function AdminFoods() {
  const [showEdit, setShowEdit] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { getFoods, foods, setFoods } = useGetFoods();
  const { categories, getCategories } = useGetCategory();
  useEffect(() => {
    getFoods();
    getCategories()
  }, []);

  const handleDelete = async () => {
    if (!selectedFood) return;
    try {
      const { data } = await axiosInstance.delete(API_PATHS.deleteFood(selectedFood._id));
      if (data.success) {
        getFoods();
        toast.success("Yemek silindi", successStyle);
      }
    } catch (err: any) {
      toast.warning(err.message || "Hata", warningStyle);
    } finally {
      setShowDelete(false);
      setSelectedFood(null);
    }
  };
  const onUpdate = () => {
    /*  setFoods(prev =>
       prev.map(f => f._id === updatedFood._id ? updatedFood : f)
     ); */
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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mt-4">

        {/* Kategori Filter */}
        <div className="w-60">
          <Select
            onValueChange={(val) => setFilterCategory(val)}
            defaultValue="all"
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" >Tümü</SelectItem>
              {categories.map(c => (
                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Ara..."
          className="border p-2 w-60 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Create */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Yemekler</h2>
        <Button onClick={() => {
          setShowCreate(true)
        }}>
          Yemek Ekle
        </Button>


      </div>

      {/* Food List */}
      <div className="grid grid-cols-3 gap-6">
        {filteredFoods.map((food) => {
          const hasTwoImages = food.imgs.length > 1;
          return (
            <div
              key={food._id}
              className="border rounded-xl p-4 shadow-md hover:shadow-lg transition w-full"
            >
              <div
                className="w-full h-48 rounded-lg overflow-hidden relative"
                onMouseMove={(e: any) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  if (!hasTwoImages) return;
                  const half = rect.width / 2;
                  e.currentTarget.querySelector("img").src =
                    x < half
                      ? `http://localhost:5000/file?path=${food.imgs[0]}`
                      : `http://localhost:5000/file?path=${food.imgs[1]}`;
                }}
              >
                <img
                  src={`http://localhost:5000/file?path=${food.imgs[0]}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-semibold text-xl mt-3">{food.name}</h3>
              <p className="text-gray-600 truncate">{food.description}</p>
              <p className="text-red-600">{categories.find(i => i._id === food.categoryId)?.name || "Kategori Yok"}</p>
              <p className="font-semibold mt-2">{food.price}₺</p>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedFood(food);
                    setShowEdit(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedFood(food);
                    setShowDelete(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yemeği Düzenle</DialogTitle>
          </DialogHeader>
          {selectedFood && <EditFoodForm food={selectedFood} onClose={() => setShowEdit(false)} onUpdate={onUpdate} />}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Yemek Ekle</DialogTitle>
          </DialogHeader>
          <CreateFoodForm />
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Silmek istediğine emin misin?</AlertDialogTitle>
            <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>İptal</Button>
            <Button variant="destructive" onClick={handleDelete}>Sil</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
