import { Module } from "@nestjs/common";
import { PrinterService } from "./printer.service";
import { PrinterController } from "./printer.controller";
import { ConsolePrinterService } from "./provider/console-printer.provider";
import { UsbThermalPrinterService } from "./provider/usb-thermal-printer.provider";
import { MyLogService } from "../logger/logger.service";
import { PRINTERS } from "./printer.constants";
@Module({
  providers: [
    PrinterService,
    ConsolePrinterService,
    UsbThermalPrinterService,
    

    {
      provide: PRINTERS,
      useFactory: (
        consolePrinter: ConsolePrinterService,
        usbPrinter: UsbThermalPrinterService,
      ) => {
        return {
          console: consolePrinter,
          usb: usbPrinter,
        };
      },
      inject: [ConsolePrinterService, UsbThermalPrinterService],
    },
  ],
  controllers: [PrinterController],
})
export class PrintModule {}