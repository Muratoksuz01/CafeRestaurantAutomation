import escpos from 'escpos';
import { Injectable } from '@nestjs/common';
import { IEngines } from './engines.interface';


@Injectable()
export class ThermalPrinter implements IEngines {
  async printData(printerIp,data: any): Promise<boolean> {
    console.log("Yazdırılacak Veri:", JSON.stringify(data, null, 2));
    console.log("thermal data");
    return true;
  }
    async printTest(printerIp: string): Promise<boolean> {
    console.log("thermal test");
    return true;
  }
}