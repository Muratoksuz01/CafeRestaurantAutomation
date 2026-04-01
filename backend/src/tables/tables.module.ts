import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from 'src/schemas/table.schemas';
import { Order, OrderSchema } from 'src/schemas/Order.schemas';
import { OrderItem, OrderItemSchema } from 'src/schemas/OrderItem.schemas';
import { User, UserSchema } from 'src/schemas/User.schemas';
import { MyLogger } from 'src/logger/logger.service';
import { LoggerModule } from 'src/logger/logger.module';

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
