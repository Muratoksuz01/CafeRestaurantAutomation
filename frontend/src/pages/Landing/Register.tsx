import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Link,  } from "react-router-dom"
import { registerSchema } from "@/models/User"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useAuthControl } from "@/lib/useAuthControl"
export default function Register() {
  useAuthControl()
  const [showPassword, setShowPassword] = useState(false)
const [loading,] = useState(false)
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      adminCode: "",
    },
  })


 /*  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    // if (res.payload.success) {
    //   if (res.payload.data) {
    //     toast.success(res.payload.message, successStyle)
    //     navigate("/admin")
    //   } else {
    //     toast.success(res.payload.message, successStyle)
    //     navigate("/login")
    //   }
    // } else {
    //   toast.warning(res.payload.message, warningStyle)
    // }
  } */

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-50 to-orange-100 flex items-center justify-center p-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo and branding */}
          <div className="flex flex-col items-center space-y-4">
           
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Cafe System</h1>
              <p className="text-sm text-slate-600 mt-2">Yeni hesap oluşturun</p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form  className="space-y-5">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">İsim</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="İsim"
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Soyisim</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Soyisim"
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">E-posta</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="ornek@email.com"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Telefon</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+90 555 123 45 67"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Şifre</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Admin Code */}
              <FormField
                control={form.control}
                name="adminCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Admin Kodu</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Admin kodunu girin"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">veya</span>
            </div>
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Zaten hesabınız var mı?{" "}
              <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">© 2025 Cafe System. Tüm hakları saklıdır.</p>
      </div>
    </div>
  )
}
