import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UploadedFiles } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyLogger } from '../../shared/logger/logger.service';
import { Food } from '../../schemas/Food.schemas';
import { HelperService } from '../../shared/helper/helper.service';

@Injectable()
export class FoodsService {
  constructor(
    
    @InjectModel(Food.name) private foodModel: Model<Food>,
    private readonly logger: MyLogger,
    private readonly helperService: HelperService

  ) {

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
    } catch (error: any) {
      console.error("Food Create Hatası:", error);
      this.logger.error(`Food Create Hatası: -Data:${JSON.stringify(createFoodDto)} -  Hata: ${error.message}`, error.stack)
      throw new InternalServerErrorException("Yemek Olusturulurken hata olustu");
    }
  }

  async findAll() {
    try {
      const foods = await this.foodModel.find({ isDeleted: false });
      return { status: true, data: foods }
    } catch (error: any) {
      console.error("Food FindALl Hatası:", error);
      this.logger.error(` Food FindALl Hatası:  -  Hata: ${error.message}`, error.stack)

      throw new InternalServerErrorException("Yemekler getirilirken hata olustu");
    }
  }



  async update(
    files: Array<Express.Multer.File>,
    id: string,
    updateFoodDto: UpdateFoodDto
  ) {
    try {
      const { name, price, description, categoryId, existingImgs } = updateFoodDto;

      const food = await this.foodModel.findById(id);
      if (!food) {
        return { status: false, message: "Food bulunamadı" };
      }

      let finalImgs: string[] = [];

      // normalize
      let existingImgsArr: string[] = [];

      if (existingImgs) {
        existingImgsArr = Array.isArray(existingImgs)
          ? existingImgs
          : [existingImgs];
      }

      // 1. kalanlar
      finalImgs = [...existingImgsArr];

      // 2. silinenler
      const deletedImgs = food.imgs.filter(
        (img: string) => !existingImgsArr.includes(img)
      );

      for (const img of deletedImgs) {
        try {
          this.helperService.deleteImage(img);
        } catch (e) { }
      }

      // 3. YENİ RESİMLERİ EKLE
      if (files && files.length > 0) {
        const uploaded = files.map((file) =>
          this.helperService.saveLocalImage(file)
        );
        finalImgs = [...finalImgs, ...uploaded];
      }

      // 4. MAX 2 GUARD (opsiyonel ama mantıklı)
      if (finalImgs.length > 2) {
        return { status: false, message: "En fazla 2 resim olabilir" };
      }

      const updated = await this.foodModel.findByIdAndUpdate(
        id,
        {
          name,
          price,
          description,
          categoryId,
          imgs: finalImgs
        },
        { new: true }
      );

      return { status: true, data: updated };

    } catch (error: any) {
      console.error("Food Update Hatası:", error);
      throw new InternalServerErrorException("Yemek Guncellenirken bir hata olustu");
    }
  }

  async remove(id: string) {
    try {
      const current = await this.foodModel.findById(id);
      if (!current) return { status: false, message: "Yemek bulunamadı", };
      current.imgs.map(img=>{
        this.helperService.deleteImage(img)
      })

      await this.foodModel.findByIdAndDelete(id)
    
      return { status: true, message: "Food deleted" }
    } catch (error: any) {
      console.error("Food Remove Hatası:", error);
      this.logger.error(` Food Remove Hatası: Gelen Id:${id} -  Hata: ${error.message}`, error.stack)

      throw new InternalServerErrorException("yemek Silinirken Hata Olustu");
    }
  }
}
