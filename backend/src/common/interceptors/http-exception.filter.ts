// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // HTTP hatası mı yoksa beklenmedik bir sistem hatası mı?
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException 
      ? exception.getResponse() 
      : null;

    // Standart hata cevabımız
    response.status(status).json({
      status: false,
      message: typeof exceptionResponse === 'object' 
        ? (exceptionResponse as any).message || exception.message 
        : exception.message || 'Bir iç sunucu hatası oluştu',
      error: exceptionResponse || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  }
}