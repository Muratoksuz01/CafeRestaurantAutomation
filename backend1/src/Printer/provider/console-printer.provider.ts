import { IPrinter } from "../printer.interface";

export class ConsolePrinterService implements IPrinter {
  constructor() {
    // Konsol servisi için ekstra bir kurulum gerekmiyor
  }

async printOrder(orderData: any): Promise<boolean> {
  try {
    const line = "-".repeat(40);
    const doubleLine = "=".repeat(40);

    console.log("\n" + doubleLine);
    console.log(" ".repeat(12) + "KAFE OTOMASYONU"); // En üst başlık
    console.log(" ".repeat(12) + "BEREKET DÖNER");   // Logo yerine
    console.log(doubleLine);

    // Üst Bilgiler (Görseldeki gibi Fiş No ve Tarih yan yana)
    const dateStr = new Date(orderData.date).toLocaleDateString("tr-TR");
    const timeStr = new Date(orderData.date).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' });
    
    console.log(`FİŞ NO: ${orderData.orderNo.padEnd(15)} ${dateStr}`);
    console.log(`MASA  : ${orderData.tableName.padEnd(15)} ${timeStr}`);
    console.log(line);

    // Sipariş Bilgisi Başlığı
    console.log(" ".repeat(12) + "SİPARİŞ BİLGİSİ");
    console.log(line);

    // Ürünler
    orderData.items.forEach((item: any) => {
      // Adet ve İsim
      console.log(`${item.qty}   ${item.name.toUpperCase()}`);
      
      // Fiyatı sağa yasla (Alt satırda veya aynı satırda görseldeki gibi)
      const priceStr = item.total.toFixed(2).replace('.', ',');
      console.log(" ".repeat(30) + priceStr.padStart(10));
    });

    console.log(line);

    // Toplam Bilgisi
    const totalLabel = "Toplam";
    const totalVal = orderData.totalAmount.toFixed(2).replace('.', ',') + " TL";
    console.log(`${totalLabel.padEnd(20)} : ${totalVal.padStart(17)}`);

    // Alt Bilgi
    console.log(line);
    console.log(" ".repeat(10) + "Bizi Tercih Ettiğiniz İçin");
    console.log(" ".repeat(15) + "Teşekkürler!");
    console.log(doubleLine + "\n");

    return true;
  } catch (error) {
    console.error("Yazdırma hatası:", error);
    return false;
  }
}
}