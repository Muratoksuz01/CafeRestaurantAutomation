// src/utils/axiosInstance.js
import {useAuthStore} from "@/store/useAuthStore";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "./apiTypes";

const axiosInstance = axios.create({
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
     const token = useAuthStore.getState().token;
   

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Backend'den gelen veriyi doğrudan döndür
    return response;
  },
  (error) => {
    // 401 Unauthorized hatası gelirse
    if (error.response && error.response.status === 401) {
      const logout = useAuthStore.getState().logout;
      
      // 1. Client-side oturumu temizle
      logout();

      // 2. Kullanıcıyı 401 (Yetki Yok) sayfasına yönlendir
      // Not: React hook'ları burada çalışmaz, bu yüzden window.location kullanılır.
      window.location.href = "/401"; 
    }

    return Promise.reject(error);
  }
)

export default axiosInstance;
