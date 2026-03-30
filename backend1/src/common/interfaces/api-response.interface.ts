// src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
  error?: any;       // Hata detayları (örn: validasyon hataları)
  statusCode?: number; // Opsiyonel: HTTP durum kodu
  timestamp?: string;
}