import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from '../../schemas/table.schemas';
import { OrderItem, OrderItemSchema } from '../../schemas/OrderItem.schemas';
import { Order, OrderSchema } from '../../schemas/Order.schemas';
import { User, UserSchema } from '../../schemas/User.schemas';



@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Table.name, schema: TableSchema, },{name: Order.name, schema: OrderSchema, },
      {name: OrderItem.name, schema: OrderItemSchema, },{name: User.name, schema: UserSchema, }
    ])
  ],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule { }
