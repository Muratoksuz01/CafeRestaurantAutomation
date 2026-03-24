import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
 app.enableCors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:6174', 
  ], // true yaparsan gelen isteğin origin'ine otomatik izin verir (Geliştirme için ok)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true, // Cookie veya Authorization header'larının geçişine izin verir
});
app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
