import z from "zod";

export const singleTableSchema = z.object({
  _id: z.string(),                     // MongoDB id string
  name: z.string(),
  status: z.enum(["bos", "dolu","rezerve"]),
  adisyon: z.object({
    id: z.string(),                    // adisyon id
    items: z.array(
      z.object({
        foodId: z.string(),
        name: z.string(),
        qty: z.number(),
        price: z.number()
      })
    ),
    total: z.number()
  }).optional()                        // masa boşsa adisyon yok
});
export const allTableSchema = z.object({
  _id: z.string(),                     // MongoDB id string
  name: z.string(),
  status: z.enum(["bos", "dolu","rezerve"]),
  currentOrderId:z.string() ,
  orderCreated:z.string(),            // masa boşsa adisyon yok
  orderTotal:z.number().optional(),
  waiterName:z.string().optional(),
});
export const tableCreateEditSchema = z.object({
    name: z.string().min(1, { message: "masa adı boş olamaz" }),
});

export type SingleTable = z.infer<typeof singleTableSchema>;
export type AllTable = z.infer<typeof allTableSchema>;
