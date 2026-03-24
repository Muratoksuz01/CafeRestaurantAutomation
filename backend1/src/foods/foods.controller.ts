import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Put } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('food')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('imgs'))
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createFoodDto: CreateFoodDto
  ) {
    return this.foodsService.create(files,createFoodDto);
  }

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

 
@Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: string, 
    @Body() updateFoodDto: UpdateFoodDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    console.log(files); // Gelen dosyaları kontrol etmek için
    return this.foodsService.update(files,id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodsService.remove(id);
  }
}
