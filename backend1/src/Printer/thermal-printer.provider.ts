import { IPrinter } from "./printer.interface";
import * as escpos from 'escpos';
// Yazıcı bağlantı tipine göre (USB veya Network) adaptörü seçmelisin
import * as USB from 'escpos-usb'; 

export class ThermalPrinterService implements IPrinter {
  async printOrder(orderData: any): Promise<boolean> {
    try {
      // 1. Yazıcıyı bul (USB için)
      const device = new USB(); 
      const printer = new escpos.Printer(device);

      device.open((error) => {
        if (error) {
          console.error("Yazıcı açılamadı:", error);
          return false;
        }

        printer
          .font('a')
          .align('ct') // Center
          .style('bu') // Bold + Underline
          .size(1, 1)
          .text('KAFE OTOMASYONU')
          .text('--------------------------------')
          .feed(1)
          .align('lt') // Left
          .style('normal')
          .size(0, 0)
          .text(`Tarih: ${new Date().toLocaleString('tr-TR')}`)
          .text(`Adisyon No: ${orderData.orderId}`)
          .text(`Masa: ${orderData.tableId}`)
          .text('--------------------------------');

        // Ürün Listesi
        orderData.items.forEach((item) => {
          // Ürün adı ve fiyatı yan yana hizalamak için boşluk hesabı yapılabilir
          printer.text(`${item.name} x ${item.qty}   ${item.price} TL`);
        });

        printer
          .text('--------------------------------')
          .align('rt') // Right
          .style('b')
          .text(`TOPLAM: ${orderData.totalAmount} TL`)
          .feed(2)
          .cut() // Kağıdı kes
          .close();
      });

      return true;
    } catch (err) {
      console.error("Termal yazdırma hatası:", err);
      return false;
    }
  }
}