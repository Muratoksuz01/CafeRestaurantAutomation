import { Module } from "@nestjs/common";
import { StandardPrinterService } from "./standard-printer.provider";
import { ThermalPrinterService } from "./thermal-printer.provider";
import { PrinterService } from "./printer.service";

@Module({
  providers: [
    PrinterService,
    {
      provide: 'PRINTER_STRATEGY',
      useFactory: () => {
        const type = process.env.PRINTER_TYPE; // 'STANDARD' veya 'THERMAL'
        return type === 'THERMAL' 
          ? new ThermalPrinterService() 
          : new StandardPrinterService();// developer da bu calişacak 
      },
    },
  ],
  exports: [PrinterService],
  
})
export class PrintModule {}