import escpos from 'escpos';
import { Injectable } from '@nestjs/common';
import { IEngines } from './engines.interface';


@Injectable()
export class ConsolePrinter implements IEngines {
  async printData(printerIp,data: object): Promise<boolean> {
    console.log("Yazdırılacak Veri:", JSON.stringify(data, null, 2));
    console.log("console data");
    return true;
  }
    async printTest(printerIp: string): Promise<boolean> {
    console.log("console test");
    return true;
  }
}