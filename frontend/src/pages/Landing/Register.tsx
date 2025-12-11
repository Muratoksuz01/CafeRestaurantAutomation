import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { registerUser } from "@/store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { registerSchema } from "@/models/User";
import { useEffect } from "react";
import { getRole } from "@/lib/utils";
import { useAuthControl } from "@/hooks/useAuthControl";




export default function Register() {
    const { user,loading, error } = useSelector((state: RootState) => state.auth);
    useAuthControl()

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
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log("Register data:", data);
    // API çağrısı yapılabilir
    const res = await dispatch(registerUser(data));
    if (res.payload.success) {

      if (res.payload.data) {
        toast.success(res.payload.message, successStyle)
        navigate("/admin")
      } else {
        toast.success(res.payload.message, successStyle)
        navigate("/login")
      }
    } else {
      console.log(res.payload.message);
      toast.warning(res.payload.message, warningStyle)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }: { field: any }) => (
                <FormItem className="flex-1">
                  <FormLabel>İsim</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="İsim" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}

            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }: { field: any }) => (
                <FormItem className="flex-1">
                  <FormLabel>soyisim</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="İsim" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem className="flex-1">
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }: { field: any }) => (
              <FormItem className="flex-1">
                <FormLabel>telefon</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="telefon" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }: { field: any }) => (
              <FormItem className="flex-1">
                <FormLabel>sifre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="sifre" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adminCode"
            render={({ field }: { field: any }) => (
              <FormItem className="flex-1">
                <FormLabel>Admin kodu</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="admin kodu" />
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
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </Button>
          <p className="text-sm text-gray-600 text-center">
            zaten hesabın varmı?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Giriş Yap
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
