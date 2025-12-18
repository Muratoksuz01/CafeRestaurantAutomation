import z from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "İsim gerekli"),
  lastName: z.string().min(1, "Soyisim gerekli"),
  email: z.string().email("Geçerli email girin"),
  phone: z.string().min(5, "Geçerli telefon girin"),
  password: z.string().min(6, "Şifre en az 6 karakter"),
  adminCode: z.string().optional(),
});
export const usersSchema = z.object({
  _id: z.int(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().optional(),
  roleName: z.enum(["Asci","Yonetici", "Garson", "Kasiyer"]),
  isActive: z.boolean().optional()
});
export const userSchema = z.object({
  _id: z.int().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().optional(),
  roleName: z.enum(["Asci","Yonetici", "Garson", "Kasiyer"]),
  permissions: z.string(),// liste geliyor 
  isActive: z.boolean().optional()
});
export const userEditSchema = z.object({
  firstName: z.string().min(1, "Ad zorunlu").min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(1, "Soyad zorunlu").min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().min(1, "E-posta zorunlu").email("Geçersiz e-posta formatı"),
  phoneNumber: z
    .string()
    .min(1, "Telefon zorunlu")
.regex(/^[0-9]{3}[0-9]{3}[0-9]{4}$/, "Telefon formatı 555 555 5555 şeklinde olmalıdır")
,  roleName: z.enum(["Asci", "Yonetici", "Garson", "Kasiyer"]),
  isActive: z.boolean(),
})

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});
export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type Users = z.infer<typeof usersSchema>;
export type User = z.infer<typeof userSchema>;
