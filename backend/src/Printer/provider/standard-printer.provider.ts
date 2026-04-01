import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as printer from 'node-printer';
import { IPrinter } from '../printer.interface';
import { print, getDefaultPrinter } from "pdf-to-printer";
export class StandardPrinterService implements IPrinter {
 private printDir: string;

  constructor() {
    this.printDir = path.join(process.cwd(), 'prints');

    // klasör yoksa oluştur
    if (!fs.existsSync(this.printDir)) {
      fs.mkdirSync(this.printDir, { recursive: true });
      console.log("prints klasörü oluşturuldu");
    }
  }
  async printOrder(orderData: any): Promise<boolean> {
    try {
      const filePath = await this.generatePdf(orderData);
     // await this.sendToPrinter(filePath);
      return true;
    } catch (err) {
      console.error("Standard print error:", err);
      return false;
    }
  }

  // 1. PDF oluştur ve kaydet
  private generatePdf(orderData: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `order-${orderData.orderId}.pdf`;
    const filePath = path.join(this.printDir, fileName);

    const PDFDocument = require('pdfkit');

    const doc = new PDFDocument({
      size: [226, 600], // ~80mm width
      margin: 10,
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    const fontPath = path.join(process.cwd(), 'fonts', 'DejaVuSans.ttf');
    doc.font(fontPath);

    // HEADER
    doc
      .fontSize(14)
      .text("KAFE OTOMASYONU", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .text(`FİŞ NO: ${orderData.orderId}`)
      .text(`Masa: ${orderData.tableId}`)
      .text(new Date().toLocaleString("tr-TR"))
      .moveDown(0.5);

    doc.text("--------------------------------");

    // BAŞLIK
    doc
      .fontSize(11)
      .text("SİPARİŞ BİLGİSİ", { align: "center" })
      .text("--------------------------------");

    // ÜRÜNLER
    orderData.items.forEach((item: any) => {
      doc
        .fontSize(10)
        .text(`${item.qty} x ${item.name}`, { continued: true })
        .text(
          `${(item.qty * item.price).toFixed(2)} TL`,
          { align: "right" }
        );
    });

    doc.text("--------------------------------");

    // TOPLAM
    doc
      .fontSize(12)
      .text(
        `TOPLAM: ${orderData.totalAmount.toFixed(2)} TL`,
        { align: "right" }
      );

    doc.moveDown(1);

    // ALT
    doc
      .fontSize(9)
      .text("Teşekkür ederiz", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}

  // 2. Yazıcıya gönder
 private async sendToPrinter(filePath: string): Promise<void> {
  try {
    const printer = await getDefaultPrinter();

    if (!printer) {
      throw new Error("Varsayılan yazıcı bulunamadı");
    }

    await print(filePath, {
      printer: printer.name, // burası önemli
    });

    console.log("PDF yazdırıldı");
  } catch (err) {
    console.error("Yazdırma hatası:", err);
    throw err;
  }
}



}