import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Form, } from "@/components/ui/form";
import { User, Lock, Mail, Phone, Shield, KeyRound } from "lucide-react";
import CustomFormField from "../Dashboard/components/CustomFormField";
import useAuthStore from "@/store/useAuthStore";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { ApiResponse } from "@/lib/apiTypes";
import { toast } from "sonner";
import { successStyle, warningStyle } from "@/lib/toastStyle";
import { User as UserModel } from "@/models/User";


export const userEditSchema = z.object({
  firstName: z
    .string()
    .min(1, "Ad zorunlu")
    .min(2, "Ad en az 2 karakter olmalı"),
  lastName: z
    .string()
    .min(1, "Soyad zorunlu")
    .min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().min(1, "E-posta zorunlu").email("Geçersiz e-posta formatı"),
  phoneNumber: z
    .string()
    .min(1, "Telefon zorunlu")
    .regex(/^[0-9]{10}$/, "Telefon formatı 10 haneli (5554443322) olmalıdır"),
});

const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Mevcut şifre en az 6 karakter olmalı"),
  newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalı"),
});

type UserEditFormValues = z.infer<typeof userEditSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;


function Profile() {
  const { user } = useAuthStore((state) => state);

  const isYonetici = user?.role === "Yonetici";
  const [passLoading, setPassLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [profile, setProfile] = useState<UserModel>()
  const onProfileUpdate = async (veri: UserEditFormValues) => {
    try {

      setEditLoading(true);
      console.log("Profil Güncelleniyor:", veri);
      const { data } = await axiosInstance.put<ApiResponse>(API_PATHS.updateProfile(user?.id.toString() || "0"), veri)
      if (data.status) {
        // update({
        //   user:
        //   {
        //     id: user?.id,
        //     email: veri.email,
        //     firsName: veri.firstName,
        //     lastName: veri.lastName,
        //     phoneNmber: veri.phoneNumber
        //   }
        // })// yapınca localstorage da user {} oluyor sistem hata veriyor 
        await fetch()
        toast.success(data.message, successStyle)
      } else {
        toast.warning(data.message, warningStyle)
      }
    } catch (error: any) {
      console.error("Profil update hata:", error);

      const message =
        error?.response?.data?.message ||
        "Profil güncellenirken hata oluştu";

      toast.error(message, warningStyle);

    } finally {
      setEditLoading(false)
    }
  };

  const onPasswordUpdate = async (veri: PasswordFormValues) => {
    try {
      setPassLoading(true);
      console.log("Şifre Güncelleniyor:", veri);
      const { data } = await axiosInstance.put<ApiResponse>(API_PATHS.UpdteProfilePassword(user?.id.toString() || "0"), veri)
      if (data.status) {
        toast.success(data.message, successStyle)
      } else {
        toast.warning(data.message, warningStyle)
      }
    } catch (error: any) {
      console.error("Şifre update hata:", error);

      const message =
        error?.response?.data?.message ||
        "Şifre güncellenirken hata oluştu";

      toast.error(message, warningStyle);
    } finally {
      setPassLoading(false)
    }
  };
  const profileForm = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const fetch = async () => {
    try {
      const res = await axiosInstance.get<ApiResponse<UserModel>>(API_PATHS.getUser(user?.id || "0"));

      if (res.data.status) {
        const userData = res.data.data;
        setProfile(userData)
        profileForm.reset({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
        });
      }
    } catch (err: any) { }

  }
  useEffect(() => {
    fetch()
  }, [])




  return (
  <div className="space-y-6">
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Profil Ayarları</h1>
    <p className="text-muted-foreground">
      Kişisel bilgilerinizi görüntüleyin ve güncelleyin
    </p>
  </div>
<Card className="border-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/30">
  <CardContent className="flex items-center gap-4 pt-6 flex-col sm:flex-row">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-700">
      <User className="h-8 w-8 text-emerald-600 dark:text-emerald-200" />
    </div>
    <div className="text-center sm:text-left">
      <h2 className="text-xl font-semibold text-foreground dark:text-gray-100">
        {profile?.firstName} {profile?.lastName}
      </h2>
      <p className="text-sm text-muted-foreground dark:text-gray-400">{profile?.email}</p>
      <span className="mt-1 inline-flex items-center justify-center sm:justify-start rounded-full bg-emerald-100 dark:bg-emerald-700/40 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-200">
        <Shield className="mr-1 h-3 w-3" />
        {profile?.roleName}
      </span>
    </div>
  </CardContent>
</Card>

  <div className="flex flex-col gap-4 sm:flex-row">
    <Card className="flex-1 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          Profil Bilgileri
        </CardTitle>
        <CardDescription>
          Temel kullanıcı bilgilerinizi buradan güncelleyebilirsiniz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileUpdate)}
            className="bg-background p-6 rounded-xl border shadow-sm space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <CustomFormField control={profileForm.control} name="firstName" title="Ad">
                {(field) => (
                  <Input
                    {...field}
                    readOnly={!isYonetici}
                    className={` text-muted-foreground ${!isYonetici ? "bg-muted cursor-not-allowed" : ""}`}
                    placeholder="Adınız"
                  />
                )}
              </CustomFormField>

              <CustomFormField control={profileForm.control} name="lastName" title="Soyad">
                {(field) => (
                  <Input
                    {...field}
                    readOnly={!isYonetici}
                    className={` text-muted-foreground ${!isYonetici ? "bg-muted cursor-not-allowed" : ""}`}
                    placeholder="Soyadınız"
                  />
                )}
              </CustomFormField>
            </div>

            <CustomFormField control={profileForm.control} name="email" title="E-posta Adresi">
              {(field) => (
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    readOnly={!isYonetici}
                    className={`pl-10 text-muted-foreground ${!isYonetici ? "bg-muted cursor-not-allowed" : ""}`}
                    placeholder="ornek@email.com"
                  />
                </div>
              )}
            </CustomFormField>

            <CustomFormField control={profileForm.control} name="phoneNumber" title="Telefon Numarası">
              {(field) => (
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    readOnly={!isYonetici}
                    className={`pl-10 text-muted-foreground ${!isYonetici ? "bg-muted cursor-not-allowed" : ""}`}
                    placeholder="5554443322"
                  />
                </div>
              )}
            </CustomFormField>

            {isYonetici && (
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={editLoading} className="w-full sm:w-auto">
                  {editLoading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>

    <Card className="flex-1 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Şifre Değiştir
        </CardTitle>
        <CardDescription>
          Hesap güvenliğiniz için şifrenizi düzenli olarak güncelleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordUpdate)}
            className="bg-background p-6 rounded-xl border shadow-sm space-y-6"
          >
            <div className="border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <KeyRound className="h-5 w-5" /> Şifre Değiştir
              </h2>
            </div>

            <CustomFormField control={passwordForm.control} name="currentPassword" title="Mevcut Şifre">
              {(field) => <Input {...field} type="password" placeholder="••••••••" className="focus-visible:ring-secondary" />}
            </CustomFormField>

            <CustomFormField control={passwordForm.control} name="newPassword" title="Yeni Şifre">
              {(field) => <Input {...field} type="password" placeholder="••••••••" className="focus-visible:ring-secondary" />}
            </CustomFormField>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="secondary" disabled={passLoading} className="w-full sm:w-auto">
                {passLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
</div>
  );
}
export default Profile;
