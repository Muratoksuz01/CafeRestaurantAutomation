import { Module } from "@nestjs/common";
import { StandardPrinterService } from "./provider/standard-printer.provider";
import { PrinterService } from "./printer.service";
import { ConsolePrinterService } from "./provider/console-printer.provider";
import { UsbThermalPrinterService } from "./provider/usb-thermal-printer.provider";

@Module({
  providers: [
    PrinterService,
    {
      provide: 'PRINTER_STRATEGY',
      useFactory: () => {
        const type = process.env.PRINTER_TYPE; // 'STANDARD' veya 'THERMAL'
        switch (type) {
          case "STANDARD":
            return new StandardPrinterService()
           case "THERMAL":
            return new UsbThermalPrinterService()
          default:
            return new ConsolePrinterService()
        }
      },
    },
  ],
  exports: [PrinterService],
  
})
export class PrintModule {}