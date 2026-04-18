import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/guard/roles.guard';
@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
//   @UseGuards( RolesGuard)
// @Roles(Role.Yonetici)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }
 @Get()

findAll() {
  return this.categoriesService.findAll();
}

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(id);
  // }

  @Put(':id')
//   @UseGuards( RolesGuard)
// @Roles(Role.Yonetici)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
//   @UseGuards( RolesGuard)
// @Roles(Role.Yonetici)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
   @Put('reassign/:id')
//    @UseGuards( RolesGuard)
// @Roles(Role.Yonetici)
  async reassign(@Param('id') id: string, @Body('newCategoryId') newCategoryId: string) {
    return this.categoriesService.reassign(id, newCategoryId);
  }
}
