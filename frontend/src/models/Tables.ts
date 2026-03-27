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

export const rezerveTableSchema = z.object({
  _id: z.string(),
  employeeName: z.string(),
  employeePhone: z.string(),
  status: z.enum(["pending", "confirmed", "cancelled"]), // Enum kullanarak daha güvenli hale getirebilirsin
  description: z.string().optional(),
  startDate: z.string().datetime(), // ISO string formatı için
  endDate: z.string().datetime(),
  masaId: z.string()
});

export type Rezerve=z.infer<typeof rezerveTableSchema>
export type SingleTable = z.infer<typeof singleTableSchema>;
export type AllTable = z.infer<typeof allTableSchema>;
