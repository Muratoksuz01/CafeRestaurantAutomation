"use client";

import { useState, useEffect } from "react";
import { useGetCategory } from "@/hooks/useGetCategory";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { successStyle, warningStyle } from "@/lib/toastStyle";

export default function AdminCategory() {
    const { categories, loading, error, getCategories } = useGetCategory();
    const [showDelete, setShowDelete] = useState(false)
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [nameInput, setNameInput] = useState("");

    useEffect(() => {
        getCategories();
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
        if (!selectedCategory) return;
        try {
            const { data } = await axiosInstance.put(API_PATHS.updateCategory(selectedCategory._id), { name: nameInput });
            if (data.success) {
                getCategories();
                toast.success("Kategori güncellendi", successStyle);
            }
        } catch (err: any) {
            toast.warning(err.message || "Hata", warningStyle);
        } finally {
            setShowEdit(false);
            setSelectedCategory(null);
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
            setSelectedCategory(null)
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Kategori Yönetimi</h1>
                <Button onClick={() => setShowCreate(true)}>Yeni Kategori</Button>
            </div>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map(cat => (
                        <div key={cat._id} className="p-4 border rounded-lg shadow-sm flex flex-col justify-between">
                            <h2 className="font-semibold text-lg mb-2">{cat.name}</h2>
                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setNameInput(cat.name);
                                        setShowEdit(true);
                                    }}
                                >
                                    Düzenle
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategory(cat); // Silinecek kategoriyi seç
                                        setShowDelete(true);       // AlertDialog'u aç
                                    }}
                                >
                                    Sil
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Yeni Kategori Oluştur</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Kategori adı"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        className="mt-2 mb-4"
                    />
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreate(false)}>
                            İptal
                        </Button>
                        <Button onClick={handleCreate}>Oluştur</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Kategoriyi Düzenle</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Kategori adı"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        className="mt-2 mb-4"
                    />
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowEdit(false)}>
                            İptal
                        </Button>
                        <Button onClick={handleEdit}>Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Silmek istediğine emin misin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowDelete(false)}>İptal</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (!selectedCategory) return;
                                handleDelete(selectedCategory._id)
                            }}
                        >
                            Sil
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
