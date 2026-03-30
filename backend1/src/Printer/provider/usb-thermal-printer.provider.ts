import escpos from 'escpos';
import { IPrinter } from '../printer.interface';
import { IPrintOrderData } from '../dto/adisyonModel';

export class UsbThermalPrinterService implements IPrinter {
  private width: number;

  constructor(paperWidth: 58 | 80 = 58) {
    // 58mm için genelde 32 karakter, 80mm için 42-48 karakter
    this.width = paperWidth === 58 ? 32 : 42;
  }

  async printOrder(orderData: IPrintOrderData): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        escpos.USB = require('escpos-usb');



        const usbDevice = new escpos.USB();
        const usbPrinter = new escpos.Printer(usbDevice);

        // const serialDevice = new escpos.Serial('/dev/usb/lp0');
        // const serialPrinter = new escpos.Printer(serialDevice);

        // const bluetoothDevice = new escpos.Bluetooth('01:23:45:67:89:AB', 1);
        // const bluetoothPrinter = new escpos.Printer(bluetoothDevice);

        // const networkDevice = new escpos.Network('localhost');
        // const networkPrinter = new escpos.Printer(networkDevice);
         // const device  = new escpos.Network('localhost');
        // const device  = new escpos.Serial('/dev/usb/lp0');
        const printer = new escpos.Printer(usbDevice);

        usbDevice.open((error) => {
          if (error) {
            console.error("Yazıcı Bağlantı Hatası:", error);
            return resolve(false);
          }

          const line = "-".repeat(this.width);

          printer
            .font('a')
            .align('ct')
            .style('b')
            .size(1, 1)
            .text('KAFE OTOMASYONU')
            .size(0, 0)
            .text('BEREKET DONER')
            .text(line)
            .align('lt')
            .style('normal')
            // Fiş No ve Tarih yan yana (Boşluk hesaplama)
            .text(this.formatRow("FIS NO: " + orderData.orderNo, new Date(orderData.date).toLocaleDateString('tr-TR')))
            .text(this.formatRow("MASA  : " + orderData.tableName, new Date(orderData.date).toLocaleTimeString('tr-TR')))
            .text(line)
            .align('ct')
            .text('SIPARIS BILGISI')
            .text(line)
            .align('lt');

          // Ürünleri listele
          orderData.items.forEach((item) => {
            // Ürün Adı ve Adet
            printer.text(`${item.qty} x ${item.name.toUpperCase()}`);
            // Fiyat sağa yaslı
            const priceStr = item.total.toFixed(2).replace('.', ',') + " TL";
            printer.align('rt').text(priceStr).align('lt');
          });

          printer
            .text(line)
            .align('rt')
            .style('b')
            .size(1, 0)
            .text(`TOPLAM: ${orderData.totalAmount.toFixed(2).replace('.', ',')} TL`)
            .size(0, 0)
            .style('normal')
            .feed(2)
            .cut()
            .close(() => resolve(true));
        });
      } catch (err) {
        console.error("Termal Yazdırma Hatası:", err);
        resolve(false);
      }
    });
  }

  // İki metni satırın iki ucuna yaslayan yardımcı fonksiyon
  private formatRow(left: string, right: string): string {
    const spaces = this.width - (left.length + right.length);
    return left + " ".repeat(Math.max(1, spaces)) + right;
  }
}