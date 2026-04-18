import type { IPrinter } from "./printer.interface"; // 'type' kelimesini ekledik
import { MyLogService } from "../logger/logger.service";
import { Injectable, Inject } from "@nestjs/common";
import { IPrintOrderData } from "./dto/adisyonModel";
import { getPrinters } from "pdf-to-printer";
import { PRINTERS } from "./printer.constants";

@Injectable()
export class PrinterService {
  constructor(
     private readonly logger: MyLogService,
    @Inject(PRINTERS) private readonly printers: Record<string, IPrinter>,
  ) {
   
  }
  async printOrder(orderData: IPrintOrderData): Promise<boolean> {
    console.log(`Yazdırma işlemi başlatılıyor: ${orderData.orderNo}`);

    try {
      const printer = this.printers[orderData.printId];

    if (!printer) {
      throw new Error("Printer bulunamadı: " + orderData.printId);
    }

    return printer.printOrder(orderData);
    } catch (error: any) {
      console.error("Yazdırma servisinde hata:", error);
      this.logger.error("yazdırma servisinde hata var :" + error.message, error.stack)
      return false;
    }
  }


  async findAll() {
  const printers = await getPrinters();
  return printers.map(p => ({
    name: p.name,
    id:p.deviceId,
    
  }));
}
}