import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { join } from 'path';
import * as express from 'express';
import { AllExceptionsFilter } from './shared/interceptors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
     origin: true,
    // origin: [
    //   'http://localhost:5173',
    //   'http://localhost:6174',
    // ], // true yaparsan gelen isteğin origin'ine otomatik izin verir (Geliştirme için ok)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Cookie veya Authorization header'larının geçişine izin verir
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use('/assets', express.static(join(process.cwd(), 'assets')));
  //app.useLogger(app.get(MyLogger));
  await app.listen(process.env.PORT ?? 6002,"0.0.0.0"); // 6001 de calişiyor 
 console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
