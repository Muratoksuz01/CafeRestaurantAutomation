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
    return Promise.reject(error);
  }
)

export default axiosInstance;
