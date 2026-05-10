import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { PrinterController } from './printer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Printer, PrinterSchema } from '../../schemas/Printer.schemas';
import { PrintingModule } from '../../shared/printing/printing.module';
import { Order, OrderSchema } from '../../schemas/Order.schemas';
import { Table, TableSchema } from '../../schemas/table.schemas';

@Module({
  imports:[
     MongooseModule.forFeature([
          { name: Printer.name, schema: PrinterSchema },
          { name: Order.name, schema: OrderSchema },
          { name: Table.name, schema: TableSchema },
        ]),
    PrintingModule

  ],
  controllers: [PrinterController],
  providers: [PrinterService],
})
export class PrinterModule {}
