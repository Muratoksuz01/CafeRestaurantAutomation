import { API_PATHS } from '@/lib/api';
import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Kullanıcı verisi için tip tanımı
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  // permissions: string[]
  role: string

}

// 2. Store'un genel yapısı için tip tanımı
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<LoginResponse>;
  logout: () => void;
}
interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string;
  };
  message?: string;
}
// 3. Store oluşturma
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        try {
          const { data: result } = await axios.post(API_PATHS.login, credentials);

          if (result.status) {
            const { user, token } = result.data;
            set({ user, token, loading: false });
           // localStorage.setItem("token",token)
            // Buradaki yapı LoginResponse interface'ine tam uymalı
            return {
              success: true,
              user: user // result.data.user'dan gelen veri
            };
          }

          set({ loading: false });
          return { success: false, message: result.message };
        } catch (error: any) {
          set({ loading: false });
          return { success: false, message: "Sunucu hatası" };
        }
      },

      logout: () => {
     //   localStorage.clear()
        set({ user: null, token: null })
      }
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;