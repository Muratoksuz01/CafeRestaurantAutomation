import z from "zod";

export const foodSchema = z.object({
    _id:z.number(),
    name: z.string().min(1, { message: "Yemek adı boş olamaz" }),
    price: z.number("Fiyat sayı olmalıdır").min(1, { message: "Fiyat 1'den küçük olamaz" }),
    description: z.string().min(1, { message: "Açıklama boş olamaz" }),
    categoryId: z.string("kategory secmelisiniz "),
    imgs: z.any().refine(files => files instanceof FileList && files.length <= 2 && files.length != 0, { message: "Tam olarak 1 yada 2 resim seçilmelidir" })
});

export const foodCreateSchema = z.object({
    name: z.string("yemek adı giriniz ").min(1, { message: "Yemek adı boş olamaz" }),
    price: z.number("Fiyat sayı olmalıdır").min(1, { message: "Fiyat 1'den küçük olamaz" }),
description: z.string().optional().default(""),
    categoryId: z.string("kategory secmelisiniz "),
    imgs: z.any().refine(files => files instanceof FileList && files.length <= 2 && files.length != 0, { message: "Tam olarak 1 yada 2 resim seçilmelidir" })
});
export const foodEditSchema = z.object({
    name: z.string().min(1, { message: "Yemek adı boş olamaz" }),
    price: z.number("Fiyat sayı olmalıdır").min(1, { message: "Fiyat 1'den küçük olamaz" }),
    description: z.string().optional(),
    categoryId: z.string("kategory secmelisiniz "),
    imgs: z
        .any()
        .optional()
        .refine((files) => {
            if (!files) return true;
            if (!(files instanceof FileList)) return false;
            if (files.length==0) return true;
            return files.length > 0 && files.length <= 2;
        }, {
            message: "1 veya 2 resim seçmelisiniz!!"
        })


});
export type Food = z.infer<typeof foodSchema>;




export const categoryCreateEditSchema = z.object({
    name: z.string()
})
export const categorySchema = z.object({
    _id:z.string(),
    name: z.string()
})
export type Category = z.infer<typeof categorySchema>;




export const rezerveSchema=z.object({
    employeeName:z.string(),
    employeePhone:z.string(),
    description:z.string(),
    startDate:z.date(),
    endDate:z.date(),
})