// src/utils/axiosInstance.js
import {useAuthStore} from "@/store/useAuthStore";
import axios from "axios";

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

export default axiosInstance;
