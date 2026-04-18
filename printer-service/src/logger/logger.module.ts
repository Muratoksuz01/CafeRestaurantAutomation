import { Global, Module } from '@nestjs/common';
import { MyLogService } from './logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Logs, LogsSchema } from '../schemas/Logs.schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Logs.name, schema: LogsSchema },
    ])
  ],
  providers: [MyLogService],
  exports: [MyLogService],
})
export class LoggerModule { }