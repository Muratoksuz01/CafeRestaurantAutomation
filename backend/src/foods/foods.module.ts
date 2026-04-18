import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from '../schemas/Food.schemas';
import { HelperModule } from '../helper/helper.module';
import { MyLogger } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
    ]),
    HelperModule,
  ],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule { }
