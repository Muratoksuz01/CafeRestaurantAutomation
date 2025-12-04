"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "@/models/User";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { loginUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { useEffect } from "react";

// Validasyon şeması



export default function Login() {
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "12345678"
    },
  });
  const navigate = useNavigate()
  useEffect(() => {
    let token = localStorage.getItem("token")
    if (token) {
      console.log(user)
      if (user?.role == "admin")
        navigate("/admin")
      else if (user?.role == "user")
        navigate("/user")
      

    }
  }, [])



  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log("Login data:", data);
    // Burada API çağrısı yapılabilir
    const res = await dispatch(loginUser(data));
    console.log(res)
    if (res.payload.success && res.payload.data) {
      if (res.payload.data.user.role == "admin") {
        navigate("/admin")
        toast.success("giriş yapıldı admin olarak", successStyle)
      }
      if (res.payload.data.user.role == "user") {
        navigate("/user")
        toast.success("giriş yapıldı user olarak", successStyle)
      }

    } else {
      console.log(res.payload);
      toast.warning(error || "giris hatası ", warningStyle)

    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-md shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl text-gray-800 font-semibold text-center">
            Login
          </h2>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="you@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            Hesabınız yok mu?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Kayıt Ol
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
