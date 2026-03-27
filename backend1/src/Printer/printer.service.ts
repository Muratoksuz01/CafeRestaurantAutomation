import { Injectable, Inject } from "@nestjs/common";
import type { IPrinter } from "./printer.interface"; // 'type' kelimesini ekledik
@Injectable()
export class PrinterService {
  constructor(
    @Inject('PRINTER_STRATEGY') private readonly printerStrategy:  IPrinter
  ) {}

  async printOrder(orderData: any): Promise<boolean> {
    console.log(`Yazdırma işlemi başlatılıyor: ${orderData.orderId}`);
    
    try {
      // Hangi strateji aktifse (PDF veya Termal) onun printOrder metodu çalışır
      return await this.printerStrategy.printOrder(orderData);
    } catch (error) {
      console.error("Yazdırma servisinde hata:", error);
      return false;
    }
  }
}