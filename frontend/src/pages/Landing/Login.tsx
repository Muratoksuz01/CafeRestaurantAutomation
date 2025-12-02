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
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "12345678"
    },
  });
  useEffect(()=>{
    console.log("login usef");
    
  },[])
  /**
   * {
    "type": "auth/loginUser/fulfilled",
    "payload": {
        "success": true,
        "message": "Login successful",
        "data": {
            "user": {
                "id": "692d939c48829e4c3db9007c",
                "firstName": "Murat",
                "lastName": "Öksüz",
                "email": "admin@example.com",
                "role": "admin",
                "phoneNumber": "05555555555"
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTJkOTM5YzQ4ODI5ZTRjM2RiOTAwN2MiLCJpYXQiOjE3NjQ1OTc0NjAsImV4cCI6MTc2NTIwMjI2MH0.cvFaAVJKGweV6I3HqpzLejhxRnBoHER4XVKxhV6AQmw"
        }
    },
    "meta": {
        "arg": {
            "email": "admin@example.com",
            "password": "12345678"
        },
        "requestId": "OYSItmcx-_NhMjlbQmVA6",
        "requestStatus": "fulfilled"
    }
}
   */
  const navigate = useNavigate()


  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log("Login data:", data);
    // Burada API çağrısı yapılabilir
    const res = await dispatch(loginUser(data));
    console.log(res)
    if (res.payload.success) {
      if(res.payload.data.user.role=="admin"){
        navigate("/admin")
        toast.success("giriş yapıldı admin olarak",successStyle)
      }
      if(res.payload.data.user.role=="user"){
        navigate("/user")
        toast.success("giriş yapıldı user olarak",successStyle)
      }
        
    }else{
      console.log(res.payload.message);
      toast.warning(res.payload.message || "giris hatası ",warningStyle)
      
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
          {/* {error && <p className="text-red-600 text-sm text-center">{error}</p>} */}

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
