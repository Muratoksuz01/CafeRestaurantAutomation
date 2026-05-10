// src/hooks/useGetCategory.ts

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/api";
import { ApiResponse } from "@/lib/apiTypes";
import { Printers } from "@/models/Food";

export function useGetPrinter() {
  const [printers, setPrinters] = useState<Printers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getPrinters() {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get<ApiResponse<Printers[]>>(API_PATHS.getPrinters);

      if (res.data.status) {
        setPrinters(res.data.data || []);
      } else {
        setError("Başarısız istek");
        setPrinters([]);
      }
    } catch (err: any) {
      setError(err.message || "Veri alınamadı");
      setPrinters([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    printers,
    loading,
    error,
    getPrinters,
    setPrinters,
  };
}
