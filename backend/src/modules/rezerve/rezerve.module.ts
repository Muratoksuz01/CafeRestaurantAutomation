import { Module } from '@nestjs/common';
import { RezerveService } from './rezerve.service';
import { RezerveController } from './rezerve.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rezerve , RezerveSchema } from '../../schemas/Rezerve.schemas';
import { Table, TableSchema } from '../../schemas/table.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema, },
      { name: Rezerve.name, schema: RezerveSchema, },
    ]),
    
  ],
  controllers: [RezerveController],
  providers: [RezerveService],
})
export class RezerveModule { }
