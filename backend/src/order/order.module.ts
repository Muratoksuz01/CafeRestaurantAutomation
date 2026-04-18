import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../schemas/Order.schemas';
import { OrderItem, OrderItemSchema } from '../schemas/OrderItem.schemas';
import { Table, TableSchema } from '../schemas/table.schemas';
import { Food, FoodSchema } from '../schemas/Food.schemas';
import { Rezerve, RezerveSchema } from '../schemas/Rezerve.schemas';
import { PrintModule } from '../Printer/print.module';
import { MyLogger } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema, },
      { name: OrderItem.name, schema: OrderItemSchema, },
      { name: Table.name, schema: TableSchema, },
      { name: Food.name, schema: FoodSchema },
      { name: Rezerve.name, schema: RezerveSchema },
    ]),
    PrintModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
