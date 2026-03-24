// src/types/api.ts

export interface ApiResponse<T = any> {
  status: boolean;    // Backend'den 'status' olarak geldiği için böyle isimlendirdik
  message: string;
  data: T;            // T, o anki verinin tipi (Table, User, Product vb.) olacak
}