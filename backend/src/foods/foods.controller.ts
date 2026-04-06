import { Controller, Get, Post, Body,  Param, Delete, 
  UseInterceptors, UploadedFiles, Put, UseGuards } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('food')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @UseGuards( RolesGuard)
  // @Roles(Role.Yonetici)
  @UseInterceptors(FilesInterceptor('imgs'))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFoodDto: CreateFoodDto
  ) {
    return this.foodsService.create(files,createFoodDto);
  }

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

 
@Put(':id')
// @UseGuards(JwtAuthGuard)
//   @UseGuards( RolesGuard)
//   @Roles(Role.Yonetici)
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
  // @UseGuards(JwtAuthGuard)
  // @UseGuards( RolesGuard)
  // @Roles(Role.Yonetici)
  remove(@Param('id') id: string) {
    return this.foodsService.remove(id);
  }
}
