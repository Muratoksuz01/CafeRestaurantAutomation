import { Module } from '@nestjs/common';
import { RezerveService } from './rezerve.service';
import { RezerveController } from './rezerve.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from 'src/schemas/table.schemas';
import { Rezerve, RezerveSchema } from 'src/schemas/Rezerve.schemas';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema, },
      { name: Rezerve.name, schema: RezerveSchema, },
    ]),
    LoggerModule
  ],
  controllers: [RezerveController],
  providers: [RezerveService],
})
export class RezerveModule { }
