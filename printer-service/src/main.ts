import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.enableCors({
     origin: true,
    // origin: [
    //   'http://localhost:5173',
    //   'http://localhost:6174',
    // ], // true yaparsan gelen isteğin origin'ine otomatik izin verir (Geliştirme için ok)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Cookie veya Authorization header'larının geçişine izin verir
  });
  await app.listen(process.env.PORT ?? 6010);
}
bootstrap();
