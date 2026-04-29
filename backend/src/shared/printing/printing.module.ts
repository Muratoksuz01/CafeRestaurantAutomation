import { Module } from "@nestjs/common";
import { ThermalPrinter } from "./engines/thermal.engine";
import { EscPrinter } from "./engines/esc-pos.engine";
import { PrintingService } from "./printing.service";
import { ConsolePrinter } from "./engines/console.engines";

@Module({
    providers: [
        PrintingService,
        ConsolePrinter,
        ThermalPrinter,
        EscPrinter
    ],
    // imports:[
    //     ConsolePrinter,
    //     ThermalPrinter,
    //     EscPrinter
    // ],
    exports:[PrintingService]
})
export class PrintingModule{}