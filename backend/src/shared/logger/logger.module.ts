import { Global, Module } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Logs, LogsSchema } from '../../schemas/Logs.schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Logs.name, schema: LogsSchema },
    ])
  ],
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule { }