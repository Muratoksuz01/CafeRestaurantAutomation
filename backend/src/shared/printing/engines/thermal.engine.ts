import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IEngines } from './engines.interface';
import {
  ThermalPrinter as Printer,
  PrinterTypes,
  CharacterSet
} from 'node-thermal-printer';

@Injectable()
export class ThermalPrinter implements IEngines {

  async printData(printerIp: string, data: any): Promise<boolean> {
    try {
      // 1. Yazıcıyı Yapılandır (Network bağlantısı için)
      // const printer = new Printer({
      //   type: PrinterTypes.EPSON, // Çoğu Çinli yazıcı Epson (ESC/POS) uyumludur
      //   interface: `tcp://${printerIp}`, // Örn: tcp://10.10.10.10
      //   characterSet: CharacterSet.PC857_TURKISH, // Türkçe karakter desteği
      //   removeSpecialCharacters: false,
      //   options: {
      //     timeout: 5000, // 5 saniye zaman aşımı
      //   },
      // });

      // 2. Bağlantı Testi (Yazıcı açık mı?)
      // const isConnected = await printer.isPrinterConnected();
      // if (!isConnected) {
      //   throw new Error(`Yazıcıya bağlanılamadı: ${printerIp}`);
      // }

      // 3. Fiş Tasarımı
      // printer.alignCenter();
      // printer.bold(true);
      // printer.setTextSize(1, 1);
      // printer.println("KAFE OTOMASYON");
      // printer.bold(false);
      // printer.setTextNormal();
      // printer.println("--------------------------------");

      // printer.alignLeft();
      // printer.println(`Masa: ${data.tableName}`);
      // printer.println(`Siparis No: #${data.orderNo}`);
      // printer.println(`Tarih: ${new Date(data.date).toLocaleString('tr-TR')}`);
      // printer.println("--------------------------------");

      // Ürünler Tablosu
      // printer.tableCustom([
      //   { text: "Ürün", align: "LEFT", width: 0.5 },
      //   { text: "Adet", align: "CENTER", width: 0.2 },
      //   { text: "Tutar", align: "RIGHT", width: 0.3 }
      // ]);

      // data.items.forEach((item) => {
      //   printer.tableCustom([
      //     { text: item.name, align: "LEFT", width: 0.5 },
      //     { text: item.qty.toString(), align: "CENTER", width: 0.2 },
      //     { text: `${item.total} TL`, align: "RIGHT", width: 0.3 }
      //   ]);
      // });

      // printer.println("--------------------------------");
      // printer.alignRight();
      // printer.bold(true);
      // printer.setTextSize(1, 1);
      // printer.println(`TOPLAM: ${data.totalAmount} TL`);
      // printer.bold(false);
      // printer.setTextNormal();

      // 4. Kağıdı Kes ve Gönder
      // printer.cut();
      // const result = await printer.execute();

      // console.log(`[Printer] Yazdırma başarılı: ${printerIp}`);
      return true;

    } catch (error: unknown) {
      if (error instanceof Error) {
        // TypeScript burada 'error'un Error tipinde olduğunu anlar
        console.error(`[Printer Error] IP: ${printerIp} - Hata:`, error.message);
        throw new InternalServerErrorException(`Yazıcı Hatası: ${error.message}`);
      } else {
        // Eğer hata beklenmedik bir tipteyse (string, null vb.)
        console.error("Bilinmeyen bir hata oluştu:", error);
        throw new InternalServerErrorException("Bilinmeyen yazıcı hatası");
      }
    }
  }

  async printTest(printerIp: string): Promise<boolean> {
    const printer = new Printer({
      type: PrinterTypes.EPSON,
      interface: `tcp://${printerIp}`,
    });

    try {
      printer.alignCenter();
      printer.println("TEST BASKISI");
      printer.println(`IP: ${printerIp}`);
      printer.println("Bağlantı Başarılı!");
      printer.cut();
      await printer.execute();
      return true;
    } catch (error) {
      return false;
    }
  }
}