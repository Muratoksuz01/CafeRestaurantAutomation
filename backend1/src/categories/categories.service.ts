// categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/Category.schemas';
import { Food, FoodDocument } from 'src/schemas/Food.schemas';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Food.name) private foodModel: Model<Food>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryModel.create(createCategoryDto);
      return { success: true, data: category };
    } catch (error) {
      console.error("Category Create Hatası:", error);
      throw error;
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryModel.find();
      return { success: true, data: categories };
    } catch (error) {
      console.error("Category FindAll Hatası:", error);
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
      if (!category) throw new NotFoundException('Kategori bulunamadı');
      return { success: true, data: category };
    } catch (error) {
      console.error("Category Update Hatası:", error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoryModel.findByIdAndDelete(id);
      if (!category) throw new NotFoundException('Kategori bulunamadı');
      return { success: true };
    } catch (error) {
      console.error("Category Remove Hatası:", error);
      throw error;
    }
  }

  async reassign(id: string, newCategoryId: string) {
    try {
      await this.foodModel.updateMany({ categoryId: id }, { categoryId: newCategoryId });
      return { success: true };
    } catch (error) {
      console.error("Category Reassign Hatası:", error);
      throw error;
    }
  }
}