import { Injectable } from "@nestjs/common";
import { EscPrinter } from "./engines/esc-pos.engine";
import { ThermalPrinter } from "./engines/thermal.engine";
import { ConsolePrinter } from "./engines/console.engines";


@Injectable()
export class PrintingService {
    constructor(
        private readonly escPrinter: EscPrinter,
        private readonly thermalPrinter: ThermalPrinter,
        private readonly consolePrinter: ConsolePrinter
    ) { }
    printTest(printerIP: string, printerType: string) {
        printerType == "thermal" && this.thermalPrinter.printTest(printerIP)
        printerType == "console" && this.consolePrinter.printTest(printerIP)
        printerType == "esc" && this.escPrinter.printTest(printerIP)

    }
    printData(printerIP: string, printerType: string,data:object) {
        printerType == "thermal" && this.thermalPrinter.printData(printerIP, data)
        printerType == "console" && this.consolePrinter.printData(printerIP, data)
        printerType == "esc" && this.escPrinter.printData(printerIP, data)
    }
}