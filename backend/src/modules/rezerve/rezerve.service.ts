import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRezerveDto } from './dto/create-rezerve.dto';
import { UpdateRezerveDto } from './dto/update-rezerve.dto';
import { MyLogger } from '../../shared/logger/logger.service';
import { Rezerve, RezerveDocument } from '../../schemas/Rezerve.schemas';
import { Table, TableDocument } from '../../schemas/table.schemas';

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
   try {
    // find() içerisine filtreleme kriterini ekliyoruz
    const results = await this.rezerveModel
      .find({ status: 'pending' }) 
      .lean();

    return { data: results };
  } catch (error) {
    console.error("Rezervasyon findAllPending Hatası:", error);
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
  try {
    // 1. Masayı bul
    const masa = await this.tableModel.findById(id);
    if (!masa) return { message: 'Masa bulunamadı', status: false };

    // 2. SADECE aktif (pending veya arrived) olan rezervasyonu bul
    // Eğer sadece masaya göre aratırsanız eski bir iptal edilmiş kaydı bulup 
    // tekrar iptal etmeye çalışıyor olabilir.
    const rezerve = await this.rezerveModel.findOne({ 
      masaId: masa._id, 
      status: { $ne: "cancelled" } // İptal edilmemiş olanı bul
    });

    if (!rezerve) {
      // Eğer rezervasyon yoksa ama masa dolu görünüyorsa masayı boşa çıkaralım
      masa.status = "bos";
      await masa.save();
      return { message: 'Aktif rezervasyon bulunamadı, masa boşa çıkarıldı', status: true };
    }

    // 3. Statüleri güncelle
    rezerve.status = "cancelled";
    masa.status = "bos";

    // 4. Değişiklikleri kaydet (Promise.all ile daha hızlı ve güvenli)
    await Promise.all([
      rezerve.save(),
      masa.save()
    ]);

    return { message: 'Rezervasyon iptal edildi ve masa boşaltıldı', status: true };
    
  } catch (error) {
    console.error("Rezervasyon remove Hatası:", error);
    throw new InternalServerErrorException('İşlem sırasında teknik bir hata oluştu.');
  }
}
}