import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from 'src/schemas/table.schemas';
import { CreateRezerveDto } from './dto/create-rezerve.dto';
import { UpdateRezerveDto } from './dto/update-rezerve.dto';
import { Rezerve, RezerveDocument } from 'src/schemas/Rezerve.schemas';

@Injectable()
export class RezerveService {
  constructor(
    @InjectModel(Rezerve.name) private rezerveModel: Model<RezerveDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async create(req:any,createRezerveDto: CreateRezerveDto) {
    const userId=req.user.userId
    const { masaId } = createRezerveDto;

    // Masa kontrolü
    const table = await this.tableModel.findById(masaId);
    if (!table) return({status:false,message:'Masa bulunamadı'});

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
  }

  async findAll() {
    const results=await this.rezerveModel.find().populate('masaId').lean()
    
    return {data:results};
  }

  async findOne(id: string) {
    const rezerve = await this.rezerveModel.findById(id).populate('masaId').lean();
    if (!rezerve) return {message:'Rezerve bulunamadı',status:false};
    return {data:rezerve};
  }

  async update(id: string, updateRezerveDto: UpdateRezerveDto) {
    const rezerve = await this.rezerveModel.findByIdAndUpdate(
      id,
      updateRezerveDto,
      { new: true },
    ).populate('masaId').lean();
    if (!rezerve) return {message:'Rezerve bulunamadı', status:false};
    return rezerve;
  }

  async remove(id: string) {
    const rezerve = await this.rezerveModel.findById(id);
    if (!rezerve) return {message:'Rezerve bulunamadı', status:false};


    // Masa durumunu "bos" yap
    const table = await this.tableModel.findById(rezerve.masaId);
    if (table) {
      table.status = 'bos';
      await table.save();
    }

    return {data:await this.rezerveModel.findByIdAndDelete(id).lean()};
  }
}