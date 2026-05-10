
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
import CustomDialog from "@/pages/Dashboard/components/CustomDialog";
import CustomAlertDialog from "@/pages/Dashboard/components/CustomAlertDialog";
import { Category, categoryCreateEditSchema, categorySchema, } from "@/models/Food";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ApiResponse } from "@/lib/apiTypes";
import CustomFormField from "../components/CustomFormField";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
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
    const onSuccess = () => {
        getCategories()
    }




    const handleDelete = async (id: string) => {
        try {
            const { data } = await axiosInstance.delete(API_PATHS.deleteCategory(id));
            if (data.status) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        className="p-4 border rounded-xl shadow-sm flex flex-col bg-background justify-between hover:border-primary/20 transition-colors"
                    >
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg mb-1 capitalize">{cat.name}</h2>
                            <p className="text-xs text-muted-foreground">Kategori</p>
                        </div>

                        {/* Butonların kapsayıcısı: wrap ekledik */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Button
                                variant="outline"
                                className="h-9 flex-1 min-w-[100px] gap-2 border-green-500/50 text-green-600 hover:bg-green-500/10 hover:text-green-600 bg-transparent"
                                size="sm"
                                onClick={() => {
                                    setSelectedCategory(cat);
                                   // setNameInput(cat.name);
                                    setShowEdit(true);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                                Düzenle
                            </Button>

                            <Button
                                variant="outline"
                                className="h-9 flex-1 min-w-[80px] gap-2 border-rose-500/50 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 bg-transparent"
                                size="sm"
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setShowDelete(true);
                                }}
                            >
                                <X className="h-4 w-4" />
                                Sil
                            </Button>
                        </div>
                    </div>
                ))}
            </div>



            <CreateCategoryDialog
                open={showCreate}
                setOpenCreate={setShowCreate}
                onSuccess={onSuccess}
            />


            {/* Edit Dialog */}
            {selectedCategory && (
                <EditCategoryDialog
                    open={showEdit}
                    setOpenEdit={setShowEdit}
                    category={selectedCategory}
                    onSuccess={onSuccess}
                />
            )}

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

                                {/* OPTION 2 - Shadcn UI Select */}
                                <div className="space-y-3">
                                    <p className="text-sm font-medium">Bu kategoriye bağlı ürünlerin yeni kategorisini seç:</p>

                                    <Select
                                        onValueChange={(value) => setSelectedCategory((prev: any) => ({ ...prev, newCategoryId: value }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Kategori seç" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {categories
                                                .filter(c => c._id !== selectedCategory._id)
                                                .map(c => (
                                                    <SelectItem key={c._id} value={String(c._id)}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        disabled={!selectedCategory.newCategoryId}
                                        className="w-full"
                                        variant="destructive" // Silme işlemi olduğu için görsel uyarı sağlar
                                        onClick={async () => {
                                            const response = await axiosInstance.put<ApiResponse>(
                                                API_PATHS.reassignFoods(String(selectedCategory._id)),
                                                { newCategoryId: selectedCategory.newCategoryId }
                                            );
                                            if (response.status) {
                                                toast.success("Ürünler yeni kategoriye taşındı", successStyle);
                                                handleDelete(String(selectedCategory._id));
                                            }
                                        }}
                                    >
                                        Kategoriyi sil ve ürünleri taşı
                                    </Button>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                </AlertDialogFooter>
                            </div>
                        ) :
                        (
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
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
interface EditDialogProps {
    open: boolean
    setOpenEdit: (open: boolean) => void
    category: SelectedCategory
    onSuccess: () => void
}
function EditCategoryDialog({ open, setOpenEdit, category, onSuccess }: EditDialogProps) {
    const form = useForm<z.infer<typeof categoryCreateEditSchema>>({
        resolver: zodResolver(categoryCreateEditSchema),
        defaultValues: {
            name: category?.name || ""
        }
    })
    useEffect(() => {
        form.reset({ name: category.name })
    }, [open])
    const handleEdit = async (data: any) => {
        try {
            const response = await axiosInstance.put<ApiResponse>(API_PATHS.updateCategory(String(category._id)),
                data);
            if (response.status) {
                onSuccess();
                toast.success("Kategori güncellendi", successStyle);
            }
        } catch (err: any) {
            toast.warning(err.message || "Hata", warningStyle);
        } finally {
            setOpenEdit(false);
        }
    };
    return (
        <CustomDialog
            open={open}
            onOpenChange={() => {
                form.reset({ name: "" })
                setOpenEdit(false)
            }}
            title="Kategorriyi Düzenle"
            description={
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-5">
                        <div className="">
                            <CustomFormField control={form.control} name="name" title="Kategori İsmi">
                                {(field: any) => <Input {...field} placeholder="Soğuk İçecekler" />}
                            </CustomFormField>
                        </div>
                        <DialogFooter className=" flex gap-2 ">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    İptal
                                </Button>
                            </DialogClose>
                            <Button type="submit">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </Form>
            }
        >

        </CustomDialog>
    )
}
interface CreateDialogProps {
    open: boolean
    setOpenCreate: (open: boolean) => void
    onSuccess: () => void
}
function CreateCategoryDialog({ open, setOpenCreate, onSuccess }: CreateDialogProps) {
    const form = useForm<z.infer<typeof categoryCreateEditSchema>>({
        resolver: zodResolver(categoryCreateEditSchema),
        defaultValues: {
            name: ""
        }
    })
    const handleCreate = async (data: any) => {
        try {
            const response = await axiosInstance.post<ApiResponse>(API_PATHS.createCategory, data);
            if (response.status) {
                onSuccess();
                toast.success("Kategori kayıt edildi", successStyle);
            }
        } catch (err: any) {
            toast.warning(err.message || "Hata", warningStyle);
        } finally {
            setOpenCreate(false);
        }
    };
    return (
        <CustomDialog
            open={open}
            onOpenChange={
                () => {
                    form.reset({ name: "" })
                    setOpenCreate(false)
                }}
            title="Kategorriyi Olustur "
            description={
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-5">
                        <div className="">
                            <CustomFormField control={form.control} name="name" title="Kategori İsmi">
                                {(field: any) => <Input {...field} placeholder="Soğuk İçecekler" />}
                            </CustomFormField>
                        </div>
                        <DialogFooter className=" flex gap-2 ">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    İptal
                                </Button>
                            </DialogClose>
                            <Button type="submit">Kaydet</Button>
                        </DialogFooter>
                    </form>
                </Form>
            }
        >

        </CustomDialog>
    )
}