// categories.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/Category.schemas';
import { Food, FoodDocument } from '../schemas/Food.schemas';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class CategoriesService {
  constructor(
            private readonly logger:MyLogger,
    
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Food.name) private foodModel: Model<Food>,
  ) {
            this.logger.setContext("CategoryService")

  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryModel.create(createCategoryDto);
      return { status: true, data: category };
    } catch (error:any) {
      console.error("Category Create Hatası:", error);
      this.logger.error(`Category Create Hatası: -Data:${JSON.stringify(createCategoryDto)} -  Hata: ${error.message}`,error.stack)
      throw new InternalServerErrorException("kategori olusturulurken hata var ");
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryModel.find();
      return { status: true, data: categories };
    } catch (error:any) {
      console.error("Category FindAll Hatası:", error);
      this.logger.error( ` Category findAll Hatası:  -  Hata: ${error.message}`,error.stack)
      throw new InternalServerErrorException("kategoriler getirilirken hata var ");
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
      if (!category) return{status:false,message:'Kategori bulunamadı'};
      return { status: true, data: category };
    } catch (error:any) {
      console.error("Category Update Hatası:", error);
      this.logger.error(`Category Update Hatası: Gelen Id:${id} -Data:${JSON.stringify(updateCategoryDto)} -  Hata: ${error.message}`,error.stack)
      throw new InternalServerErrorException("kategori guncellenirken hata var ");
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoryModel.findByIdAndDelete(id);
      if (!category) return{status:false,message:'Kategori bulunamadı'};
      return { status: true };
    } catch (error:any) {
      console.error("Category Remove Hatası:", error);
      this.logger.error( ` Category Remove Hatası: Gelen Id:${id} -  Hata: ${error.message}`,error.stack)
      throw new InternalServerErrorException("kategori silinirken hata var ");
    }
  }

  async reassign(id: string, newCategoryId: string) {
    try {
      await this.foodModel.updateMany({ categoryId: id }, { categoryId: newCategoryId });
      return { status: true };
    } catch (error:any) {
      console.error("Category Reassign Hatası:", error);
      this.logger.error( ` Category GetUser Hatası: Gelen Id:${id}  NewKategoryId:${newCategoryId}-  Hata: ${error.message}`,error.stack)
      throw new InternalServerErrorException("kategori yeniden atanırken hata var ");
    }
  }
}