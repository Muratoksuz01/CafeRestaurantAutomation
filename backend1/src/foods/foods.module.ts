import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from 'src/schemas/Food.schemas';
import { HelperModule } from 'src/helper/helper.module';

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
