import z, { string } from "zod";

export const foodSchema = z.object({
    _id: z.number(),
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
        .array(z.instanceof(File))
        .max(2, { message: "En fazla 2 resim ekleyebilirsiniz" })
        .optional(),
    existingImgs: z.array(z.string()).optional()
});
export type Food = z.infer<typeof foodSchema>;




export const categoryCreateEditSchema = z.object({
    name: z.string()
})
export const categorySchema = z.object({
    _id: z.string(),
    name: z.string()
})
export type Category = z.infer<typeof categorySchema>;


export interface Printers {
    _id: number
    name: string
    printerIp: string
    printerType: string
}
export const printerCreateEditSchema = z.object({
    name: z.string().min(1, "Yazıcı ismi zorunludur"),
    printerIp: z.string().ipv4({
        //version: "v4", 
        message: "Geçerli bir IPv4 adresi giriniz (Örn: 192.168.1.1)"
    }),
    printerType: z.string().min(1, "Lütfen bir tip seçin"),
});

export const rezerveSchema = z.object({
    employeeName: z.string(),
    employeePhone: z.string(),
    description: z.string(),
    //startDate:z.date(),
    endDate: z.date(),
})