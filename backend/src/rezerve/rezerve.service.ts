import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../schemas/table.schemas';
import { CreateRezerveDto } from './dto/create-rezerve.dto';
import { UpdateRezerveDto } from './dto/update-rezerve.dto';
import { Rezerve, RezerveDocument } from '../schemas/Rezerve.schemas';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class RezerveService {
  constructor(
    private readonly logger:MyLogger,
    @InjectModel(Rezerve.name) private rezerveModel: Model<RezerveDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) { 
  }

  async create(req: any, createRezerveDto: CreateRezerveDto) {
    const userId = req.user.userId
    const { masaId } = createRezerveDto;
    try {


      // Masa kontrolü
      const table = await this.tableModel.findById(masaId);
      if (!table) {
        // Hata değil, bir iş kuralı ihlali (Uyarı/Warn)
        this.logger.warn("RezerveService",`Rezervasyon başarısız: Masa bulunamadı. MasaID: ${masaId}`);
        return { status: false, message: 'Masa bulunamadı' };
      }
      // Masa durumunu "rezerve" yap
      table.status = 'rezerve';

      await table.save();

      // Rezerve oluştur
      const rezerve = new this.rezerveModel({
        ...createRezerveDto,
        masaId: new Types.ObjectId(masaId),
        status: 'pending', // default status
      });
      await rezerve.save()
      return rezerve
    } catch (error:any) {
      this.logger.error(
        `Rezervasyon Create Hatası! User: ${userId}, Data: ${JSON.stringify(createRezerveDto)} - Hata: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Rezervasyon oluşturulurken teknik bir hata oluştu.');
    }
  }

  async findAll() {
    try{
    const results = await this.rezerveModel.find().lean()

    return { data: results };
    } catch (error) {
      console.error("Rezervasyon findAll Hatası:", error);
      throw error;
    }
  }

  async findOne(id: string) {
    try{
    const rezerve = await this.rezerveModel.findById(id).populate('masaId').lean();
    if (!rezerve) return { message: 'Rezerve bulunamadı', status: false };
    return { data: rezerve };
    } catch (error) {
      console.error("Rezervasyon findOne Hatası:", error);
      throw new InternalServerErrorException('Rezervasyonlar getirilirken teknik bir hata oluştu.');
    }
  }

  async update(id: string, updateRezerveDto: UpdateRezerveDto) {
    try{
    const rezerve = await this.rezerveModel.findByIdAndUpdate(
      id,
      updateRezerveDto,
      { new: true },
    ).populate('masaId').lean();
    if (!rezerve) return { message: 'Rezerve bulunamadı', status: false };
    return rezerve;
    } catch (error) {
      console.error("Rezervasyon update Hatası:", error);
      throw new InternalServerErrorException('Rezervasyon guncellenirken teknik bir hata oluştu.');
    }
  }

  async remove(id: string) {
    try{
    const masa = await this.tableModel.findById(id);
    if (!masa) return { message: 'Masa bulunamadı', status: false };
    masa.status = "bos"

    const rezerve = await this.rezerveModel.findOne({ masaId: masa._id });
    if (!rezerve) return { message: 'Rezervasyon bulunamadı', status: false };

    rezerve.status = "cancelled"
    await rezerve.save()
    await masa.save()


    return masa;
    } catch (error) {
      console.error("Rezervasyon remove Hatası:", error);
      throw new InternalServerErrorException('Rezervasyon silinirken teknik bir hata oluştu.');
    }
  }
}