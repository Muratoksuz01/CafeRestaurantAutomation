import z from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "İsim gerekli"),
  lastName: z.string().min(1, "Soyisim gerekli"),
  email: z.string().email("Geçerli email girin"),
  phone: z.string().min(5, "Geçerli telefon girin"),
  password: z.string().min(6, "Şifre en az 6 karakter"),
  adminCode:z.string().optional(),
});
export const userSchema = z.object({
  _id:z.int(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().optional(),
  role:z.enum(["admin","user"]),
  isActive:z.boolean().optional()
});
export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});
export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;
