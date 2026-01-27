"use client";

import { useState, useEffect } from "react";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Button } from "@/components/ui/button";
import { AlertDialogFooter, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useGetFoods } from "@/hooks/useGetFoods";
import { Pencil, X } from "lucide-react";
import CustomDialog from "@/components/CustomDialog";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { Category, } from "@/models/Food";
type SelectedCategory = Category & {
    newCategoryId?: string
}

export default function AdminCategory() {
    const { categories, loading, error, getCategories } = useGetCategory();
    const { foods, getFoods } = useGetFoods()
    const [showDelete, setShowDelete] = useState(false)
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>();
    const [nameInput, setNameInput] = useState("");

    useEffect(() => {
        getCategories();
        getFoods()
    }, []);

    const handleCreate = async () => {
        try {
            const { data } = await axiosInstance.post(API_PATHS.createCategory, { name: nameInput });
            if (data.success) {
                getCategories();
                toast.success("Kategori oluşturuldu", successStyle);
            }
        } catch (err: any) {
            toast.warning(err.message || "Hata", warningStyle);
        } finally {
            setShowCreate(false);
            setNameInput("");
        }
    };

    const handleEdit = async () => {
        if (!selectedCategory) return toast.warning( "Hata:seçili kategori yok", warningStyle);
        if (!nameInput) return toast.warning( "Hata:yeni kategori ismi girilmedi", warningStyle);
        try {
            const { data } = await axiosInstance.put(API_PATHS.updateCategory(String(selectedCategory._id)), 
            { name: nameInput });
            if (data.success) {
                getCategories();
                toast.success("Kategori güncellendi", successStyle);
            }
        } catch (err: any) {
            toast.warning(err.message || "Hata", warningStyle);
        } finally {
            setShowEdit(false);
            setSelectedCategory(undefined);
            setNameInput("");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { data } = await axiosInstance.delete(API_PATHS.deleteCategory(id));
            if (data.success) {
                getCategories()
                toast.success("Kategori silindi", successStyle);
            }

        } catch (err: any) {
            toast.warning(err.message || "Hata", warningStyle);
        } finally {
            setShowDelete(false)
            setSelectedCategory(undefined)
        }
    };
    if (loading)
        return <p>Yükleniyor...</p>
    else if (error)
        return <p className="text-red-500">{error}</p>
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Kategori Yönetimi</h1>
                <Button className="bg-foreground text-background" onClick={() => setShowCreate(true)}>Yeni Kategori</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 gap-4">
                {categories.map(cat => (
                    <div key={cat._id} className="p-4 border rounded-lg shadow-sm flex flex-col bg-background justify-between">
                        <h2 className="font-semibold text-lg mb-2">{cat.name}</h2>
                        <div className="flex gap-2 mt-4">
                            <Button
                                variant="outline"
                                className="h-8 gap-2 border-green-500/50 text-green-600 hover:bg-green-500/10 hover:text-green-600 bg-transparent"
                                size="sm"
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setNameInput(cat.name);
                                    setShowEdit(true);
                                }}
                            >
                                <Pencil />
                                Düzenle
                            </Button>

                            <Button
                                variant="outline"
                                className="h-8 gap-2 border-rose-500/50 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 bg-transparent"

                                size="sm"
                                onClick={() => {
                                    setSelectedCategory(cat); // Silinecek kategoriyi seç
                                    setShowDelete(true);       // AlertDialog'u aç
                                }}
                            >
                                <X className="h-4 w-4" />
                                Sil
                            </Button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Create Dialog */}
            <CustomDialog open={showCreate} onOpenChange={setShowCreate}
                title={"Yeni Kategori Oluştur"}
                description={
                    <Input
                        placeholder="Kategori adı"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        className="mt-2 mb-4"
                    />
                }
                onConfirm={handleCreate}
            />


            {/* Edit Dialog */}
            <CustomDialog open={showEdit} onOpenChange={setShowEdit}
                title={"Kategoriyi Düzenle"}
                description={
                    <Input
                        placeholder="Kategori adı"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        className="mt-2 mb-4"
                    />
                }
                onConfirm={handleEdit}
            />


            {/* DELETE CATEGORY DIALOG WITH OPTIONS */}
            <CustomAlertDialog open={showDelete} onOpenChange={setShowDelete}
                title={`${selectedCategory?.name} bu kategortiyi silmek istedignize eminmisiniz `}
                description={
                    selectedCategory && foods.some(f => f.categoryId === String(selectedCategory._id)) ? (
                        <AlertDialogDescription className="text-red-600">
                            Bu kategoriye bağlı ürünler var. Bir seçenek seçmelisin:
                        </AlertDialogDescription>
                    ) : (
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    )
                }

                footer={
                    selectedCategory && foods.some(f => f.categoryId === String(selectedCategory._id)) ?
                        (
                            <div className="space-y-4 mt-4">
                                {/* OPTION 1 */}
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => handleDelete(String(selectedCategory._id))}
                                >
                                    Kategoriyi ve bağlı tüm ürünleri sil
                                </Button>

                                {/* OPTION 2 */}
                                <div className="space-y-2">
                                    <p>Bu kategoriye bağlı ürünlerin yeni kategorisini seç:</p>
                                    <select
                                        className="border p-2 w-full rounded"
                                        onChange={(e) => setSelectedCategory((prev: any) => ({ ...prev, newCategoryId: e.target.value }))}
                                    >
                                        <option value="">Kategori seç</option>
                                        {categories
                                            .filter(c => c._id !== selectedCategory._id)
                                            .map(c => (
                                                <option key={c._id} value={c._id}>{c.name}</option>
                                            ))
                                        }
                                    </select>

                                    <Button
                                        disabled={!selectedCategory.newCategoryId}
                                        className="w-full"
                                        onClick={async () => {
                                            const { data } = await axiosInstance.put(
                                                API_PATHS.reassignFoods(String(selectedCategory._id)),
                                                { newCategoryId: selectedCategory.newCategoryId }
                                            );

                                            if (data.success) {
                                                toast.success("Ürünler yeni kategoriye taşındı", successStyle);
                                                handleDelete(String(selectedCategory._id));
                                            }
                                        }}
                                    >
                                        Kategoriyi sil ve ürünleri bu kategoriye taşı
                                    </Button>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    {/* <Button variant="outline" onClick={() => setShowDelete(false)}>İptal</Button> */}

                                </AlertDialogFooter>
                            </div>
                        ) :
                        (
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                {/* <Button variant="outline" onClick={() => setShowDelete(false)}>İptal</Button> */}
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(String(selectedCategory!._id))}
                                >
                                    Sil
                                </Button>
                            </AlertDialogFooter>
                        )
                }
            />


        </div>
    );
}
