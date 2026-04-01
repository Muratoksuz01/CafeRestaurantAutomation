    import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MyLogger extends ConsoleLogger {
  private readonly logDir = 'logs';
  private readonly logFile = 'app.log';

  constructor() {
    super();
    // Log klasörü yoksa oluştur
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  // Tüm log türlerini yakalamak için ana yazma fonksiyonunu override ediyoruz
  private writeToFile(level: string, message: any, context?: string) {
    const timestamp = new Date().toLocaleString('tr-TR');
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] [${context || 'App'}] ${message}\n`;
    
    const filePath = path.join(this.logDir, this.logFile);
    fs.appendFileSync(filePath, logEntry, 'utf8');
  }

  log(message: any, context?: string) {
    super.log(message, context); // Konsola yazdırır
    this.writeToFile('log', message, context); // Dosyaya yazdırır
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.writeToFile('error', `${message} - Stack: ${stack}`, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.writeToFile('warn', message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.writeToFile('debug', message, context);
  }
}