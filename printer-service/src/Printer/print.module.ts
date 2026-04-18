import { Module } from "@nestjs/common";
import { PrinterService } from "./printer.service";
import { PrinterController } from "./printer.controller";

@Module({
  imports: [], // MyLogger'ın export edildiğinden emin ol
  providers:[PrinterService],
  controllers:[PrinterController],
})
export class PrintModule {}