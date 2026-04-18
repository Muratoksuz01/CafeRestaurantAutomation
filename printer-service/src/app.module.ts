import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { PrinterService } from './Printer/printer.service';
import { PrintModule } from './Printer/print.module';

@Module({
  imports: [LoggerModule,PrintModule],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
