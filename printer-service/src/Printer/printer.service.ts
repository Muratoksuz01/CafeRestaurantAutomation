import { Injectable, Inject } from "@nestjs/common";
import type { IPrinter } from "./printer.interface"; // 'type' kelimesini ekledik
import { IPrintOrderData } from "./dto/adisyonModel";
import { MyLogger } from "../logger/logger.service";
import * as printer from 'node-printer';
import { getPrinters } from "pdf-to-printer";

@Injectable()
export class PrinterService {
  constructor(
    // private readonly logger: MyLogger,
    // @Inject('PRINTER_STRATEGY') private readonly printerStrategy: IPrinter
  ) {
    //   this.logger.setContext("PrinterService")
  }
async findAll() {
  const printers = await getPrinters();
  return printers.map(p => ({
    name: p.name,
    id:p.deviceId,
  //  paperSize:p.paperSizes
    
  }));
}




  // async printOrder(orderData: IPrintOrderData): Promise<boolean> {
  //   console.log(`Yazdırma işlemi başlatılıyor: ${orderData.orderNo}`);

    // try {
    //   // Hangi strateji aktifse (PDF veya Termal) onun printOrder metodu çalışır
    //   return await this.printerStrategy.printOrder(orderData);
    // } catch (error: any) {
    //   console.error("Yazdırma servisinde hata:", error);
    //   this.logger.error("yazdırma servisinde hata var :" + error.message, error.stack)
    //   return false;
    // }
  // }
}