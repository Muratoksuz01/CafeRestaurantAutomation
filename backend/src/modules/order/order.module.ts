import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from '../../schemas/table.schemas';
import { Order, OrderSchema } from '../../schemas/Order.schemas';
import { OrderItem, OrderItemSchema } from '../../schemas/OrderItem.schemas';
import { Rezerve, RezerveSchema } from '../../schemas/Rezerve.schemas';
import { Food, FoodSchema } from '../../schemas/Food.schemas';
import { PrintingModule } from '../../shared/printing/printing.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
      { name: Order.name, schema: OrderSchema, },
      { name: OrderItem.name, schema: OrderItemSchema, },
      { name: Table.name, schema: TableSchema, },
      { name: Rezerve.name, schema: RezerveSchema },
    ]),
    PrintingModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
