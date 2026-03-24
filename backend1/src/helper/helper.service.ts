import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class HelperService {
  private readonly uploadPath = path.join(process.cwd(), "assets", "foods");

  constructor() {
    // Klasör yoksa oluştur
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Dosyayı diske kaydeder ve erişim yolunu döner.
   * Return tipi 'string' olduğu için 'void' hatasını çözer.
   */
  saveLocalImage(file: Express.Multer.File): string {
    try {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const filename = `${base}-${Date.now()}${ext}`;
      const filePath = path.join(this.uploadPath, filename);

      // Multer memoryStorage kullanıyorsa buffer buradadır
      fs.writeFileSync(filePath, file.buffer);

      // Veritabanına kaydedilecek URL yolunu dönüyoruz
      return `/assets/foods/${filename}`;
    } catch (error) {
      throw new InternalServerErrorException("Dosya kaydedilirken hata oluştu");
    }
  }

  /**
   * Verilen yoldaki dosyayı siler.
   */
  deleteImage(relativePath: string): void {
    try {
      // relativePath genelde "/assets/foods/dosya.jpg" şeklinde gelir
      // Baştaki slash'ı temizleyip ana dizinle birleştiriyoruz
      const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
      const fullPath = path.join(process.cwd(), cleanPath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error("Image delete error:", err);
      // Silme hatası genelde akışı bozmamalı, sadece loglanır
    }
  }
}