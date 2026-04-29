import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: data?.status ?? true,
        message: data?.message || 'İşlem başarılı',
        // Eğer data içinde mesaj gönderdiysek, onu ayıklayıp geri kalanı data'ya koyarız
        data: data.data ? data.data:null
        
        //data: data?.data !== undefined ? data.data : data, 
    //    timestamp: new Date().toISOString(),
      })),
    );
  }
}