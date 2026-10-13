import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seedService = app.get(SeedService);
    await seedService.runSeed();

    console.log('Seed işlemi başarıyla tamamlandı.');
  } catch (error) {
    console.error('Seed işlemi başarısız:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();
