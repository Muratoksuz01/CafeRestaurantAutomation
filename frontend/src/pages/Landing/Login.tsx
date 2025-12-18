import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { getPermission, loginUser } from "@/store/slices/authSlice"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"
import { loginSchema } from "@/models/User"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { getRole } from "@/lib/utils"
import { useAuthControl } from "@/hooks/useAuthControl"
import CustomFormField from "@/components/CustomFormField"

export default function Login() {
  const { loading, error } = useSelector((state: RootState) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  useEffect(() => {
    const role = getRole();

    if (role === "Yonetici") {
      navigate("/admin/overview");
    } else if (role === "Kasiyer" || role === "Garson") {
      navigate("/user/overview");
    }
  }, []);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@kafe.com",
      password: "123456",
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log("Login data:", data);
    // Burada API çağrısı yapılabilir
    const res = await dispatch(loginUser(data));
    if (res.payload.success && res.payload.data) {
      if (getRole() == "Yonetici") {
        navigate("/admin/overview")
        toast.success("Yönetici olarak Giriş yapıldı", successStyle)
      }
      else if (getRole() == "Kasiyer" || getRole() == "Garson") {
        navigate("/user/overview")
        toast.success(`${getRole()} olarak Giriş yapıldı`, successStyle)
      } else {
        toast.warning(`get role :${getRole()}`, warningStyle)
        console.log(getRole())
      }
      await dispatch(getPermission())


    } else {
      console.log(res.payload);
      toast.warning(error || res.payload || "giris hatası ", warningStyle)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-50 to-orange-100 flex items-center justify-center p-4">
      {/* Background decorative element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card with shadow */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo and branding */}
          <div className="flex flex-col items-center space-y-4">

            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Cafe System</h1>
              <p className="text-sm text-slate-600 mt-2">Kahve dükkanınızı yönetin</p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <p className="cursor-pointer m-0 p-0" onClick={() => { form.setValue("email", "kasiyer@kafe.com") }}>kasiyer@kafe.com</p>
              <p className="cursor-pointer m-0 p-0" onClick={() => { form.setValue("email", "garson@kafe.com") }}>garson@kafe.com</p>
              <CustomFormField control={form.control} name={"email"} title="Email" >
                {(field: any) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="ornek@email.com"
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                  />
                )}
              </CustomFormField>

              <CustomFormField control={form.control} name={"password"}title="Sifre"  >
                {(field: any) => (
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
                )}
              </CustomFormField>


              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
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

          {/* Register link */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Henüz hesabınız yok mu?{" "}
              <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-slate-600 text-xs mt-6">© 2025 Cafe System. Tüm hakları saklıdır.</p>
      </div>
    </div>
  )
}
