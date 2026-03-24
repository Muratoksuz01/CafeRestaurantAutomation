import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/Order.schemas';
import { OrderItem, OrderItemSchema } from 'src/schemas/OrderItem.schemas';
import { Table, TableSchema } from 'src/schemas/table.schemas';
import { Food, FoodSchema } from 'src/schemas/Food.schemas';

@Module({
  imports:[
          MongooseModule.forFeature([
              {name:Order.name,schema:OrderSchema,},
              {name:OrderItem.name,schema:OrderItemSchema,},
            {name:Table.name,schema:TableSchema,},
            { name: Food.name, schema: FoodSchema },
          
          ])
      ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
