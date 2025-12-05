import z from "zod";

export const tableSchema = z.object({
    _id: z.number(),
    name: z.string(),
    status: z.enum(["bos", "dolu"]),
    currentOrderId: z.string().optional()
});

export const tableCreateEditSchema = z.object({
    name: z.string().min(1, { message: "masa adı boş olamaz" }),
});

export type MyTable = z.infer<typeof tableSchema>;
