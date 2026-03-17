import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Food } from 'src/schemas/Food.schemas';
import { Model } from 'mongoose';

@Injectable()
export class FoodsService {
   constructor(
      @InjectModel(Food.name) private foodModel: Model<Food>,
    ) {}
  create(createFoodDto: CreateFoodDto) {
    return 'This action adds a new food';
  }

  findAll() {
    return `This action returns all foods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} food`;
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
