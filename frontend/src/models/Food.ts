import z from "zod";

export const foodSchema = z.object({
name: z.string().min(1, { message: "Yemek adı boş olamaz" }),
price: z.number( "Fiyat sayı olmalıdır" ).min(1, { message: "Fiyat 1'den küçük olamaz" }),
description: z.string().min(1, { message: "Açıklama boş olamaz" }),
categoryId:z.string("kategory secmelisiniz "),
imgs: z.any().refine(files => files instanceof FileList && files.length <= 2 && files.length != 0, {message: "Tam olarak 1 yada 2 resim seçilmelidir"})
});

export const categorySchema=z.object({
    name:z.string()
})