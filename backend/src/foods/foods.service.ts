import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UploadedFiles } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Food } from 'src/schemas/Food.schemas';
import { Model } from 'mongoose';
import { HelperService } from 'src/helper/helper.service';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class FoodsService {
  constructor(
    private readonly logger: MyLogger,

    @InjectModel(Food.name) private foodModel: Model<Food>,
    private readonly helperService: HelperService

  ) {
    this.logger.setContext("FoodService")

  }
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    createFoodDto: CreateFoodDto
  ) {
    try {
      const { name, price, description, categoryId } = createFoodDto

      if (!files || !Array.isArray(files) || files.length < 1 || files.length > 2) {
        return ({ status: false, message: "1 veya 2 resim seçilmelidir" });
      }
      const newImgs = files.map(file => this.helperService.saveLocalImage(file));
      const food = await this.foodModel.create({
        name,
        price,
        description: description || "",
        categoryId: categoryId || "",
        imgs: newImgs,
        isDeleted: false
      });
      return { data: food }
    } catch (error) {
      console.error("Food Create Hatası:", error);
      this.logger.error(`Food Create Hatası: -Data:${JSON.stringify(createFoodDto)} -  Hata: ${error.message}`,error.stack)
      throw new InternalServerErrorException("Yemek Olusturulurken hata olustu");
    }
  }

  async findAll() {
    try {
      const foods = await this.foodModel.find({ isDeleted: false });
      return { status: true, data: foods }
    } catch (error) {
      console.error("Food FindALl Hatası:", error);
      this.logger.error( ` Food FindALl Hatası:  -  Hata: ${error.message}`,error.stack)

      throw new InternalServerErrorException("Yemekler getirilirken hata olustu");
    }
  }



  async update(
    @UploadedFiles() files: Array<Express.Multer.File>,
    id: string,
    updateFoodDto: UpdateFoodDto
  ) {
    try {
      const { name, price, description, categoryId } = updateFoodDto;
      // multer files
      const food = await this.foodModel.findById(id);
      if (!food) return { status: false, message: "Food bulunamadı", };
      let newImgs = food.imgs; // default olarak eski resimler

      // Yeni resim geldiyse işleme al
      if (files && files.length > 0) {
        // Eski resimleri sil
        for (const img of food.imgs) {
          try {
            this.helperService.deleteImage(img) //  
          } catch (e) { }
        }

        // Yeni resimleri kaydet
        newImgs = files.map((file) => this.helperService.saveLocalImage(file));
      }

      const updated = await this.foodModel.findByIdAndUpdate(
        id,
        {
          name,
          price,
          description,
          categoryId,
          imgs: newImgs
        },
        { new: true }
      );
      return { status: true, data: updated }



    } catch (error) {
      console.error("Food Update Hatası:", error);
      this.logger.error(`Food Update Hatası: Gelen Id:${id} -Data:${JSON.stringify(updateFoodDto)} -  Hata: ${error.message}`,error.stack)


      throw new InternalServerErrorException("Yemek Guncellenirken bir hata olustu");
    }
  }

  async remove(id: string) {
    try {
      const current = await this.foodModel.findById(id);
      if (!current) return { status: false, message: "User bulunamadı", };
      await this.foodModel.findByIdAndUpdate(id, {
        isDeleted: true
      });
      return { status: true, message: "Food deleted" }
    } catch (error) {
      console.error("Food Remove Hatası:", error);
      this.logger.error( ` Food Remove Hatası: Gelen Id:${id} -  Hata: ${error.message}`,error.stack)

      throw new InternalServerErrorException("yemek Silinirken Hata Olustu");
    }
  }
}
