import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { join } from 'path';
import * as express from 'express';
import { MyLogger } from './logger/logger.service';
import { AllExceptionsFilter } from './common/interceptors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors();
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use('/assets', express.static(join(__dirname, '..', 'assets')));
  app.useLogger(app.get(MyLogger));
  await app.listen(process.env.PORT ?? 6002,"0.0.0.0");
console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
