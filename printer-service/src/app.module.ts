import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IprinterService } from './iprinter/iprinter.service';
import { LoggerModule } from './logger/logger.module';
import { PrinterService } from './Printer/printer.service';

@Module({
  imports: [LoggerModule,PrinterService],
  controllers: [AppController],
  providers: [AppService, IprinterService],
})
export class AppModule {}
