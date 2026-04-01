import { Module } from "@nestjs/common";
import { MyLogger } from "src/logger/logger.service";
import { PrinterService } from "./printer.service";
import { StandardPrinterService } from "./provider/standard-printer.provider";
import { UsbThermalPrinterService } from "./provider/usb-thermal-printer.provider";
import { ConsolePrinterService } from "./provider/console-printer.provider";
import { LoggerModule } from "src/logger/logger.module";

@Module({
  imports: [], // MyLogger'ın export edildiğinden emin ol
  providers: [
    PrinterService,
    {
      provide: 'PRINTER_STRATEGY',
      // Factory fonksiyonuna logger'ı parametre olarak ekle
      useFactory: (logger: MyLogger) => {
        const type = process.env.PRINTER_TYPE;
        
        switch (type) {
          case "STANDARD":
            return new StandardPrinterService(); // Logger'ı gönder
          case "THERMAL":
            return new UsbThermalPrinterService(); // Logger'ı gönder
          default:
            return new ConsolePrinterService(logger); // Hatanın çözüldüğü yer
        }
      },
      // NestJS'e bu factory için logger gerektiğini söyle
      inject: [MyLogger], 
    },
  ],
  exports: [PrinterService],
})
export class PrintModule {}