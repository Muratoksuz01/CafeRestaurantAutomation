import { Model } from "mongoose";
import { CreatePrinterDto } from "./dto/create-printer.dto";
import { UpdatePrinterDto } from "./dto/update-printer.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { MyLogger } from "../../shared/logger/logger.service";
import { Printer } from "../../schemas/Printer.schemas";

@Injectable()
export class PrinterService {
  constructor(
    private readonly logger: MyLogger,
    @InjectModel(Printer.name) private printerModel: Model<Printer>,
  ) {}

  private logError(context: string, error: unknown) {
    if (error instanceof Error) {
      this.logger.error(context, error.message, error.stack);
    } else {
      this.logger.error(context, String(error));
    }
  }

  async create(createPrinterDto: CreatePrinterDto) {
    try {
      const { printerIp } = createPrinterDto;
console.log(createPrinterDto)
      const existing = await this.printerModel.findOne({ printerIp });

      if (existing) {
        return {
          status: false,
          message: 'Bu IP ile kayıtlı yazıcı zaten var',
          data: existing,
        };
      }

      const created = await this.printerModel.create(createPrinterDto);

      return {
        status: true,
        message: 'Yazıcı eklendi',
        data: created,
      };
    } catch (error: unknown) {
      this.logError('PrinterService.create', error);

      return {
        status: false,
        message: 'Yazıcı eklenirken hata oluştu',
      };
    }
  }

  async findAll() {
    try {
      const printers = await this.printerModel.find();

      return {
        status: true,
        message: 'Yazıcılar listelendi',
        data: printers,
      };
    } catch (error: unknown) {
      this.logError('PrinterService.findAll', error);

      return {
        status: false,
        message: 'Yazıcılar alınamadı',
      };
    }
  }

  async findOne(id: string) {
    try {
      const printer = await this.printerModel.findById(id);

      if (!printer) {
        return {
          status: false,
          message: 'Yazıcı bulunamadı',
        };
      }

      return {
        status: true,
        message: 'Yazıcı bulundu',
        data: printer,
      };
    } catch (error: unknown) {
      this.logError('PrinterService.findOne', error);

      return {
        status: false,
        message: 'Yazıcı getirilirken hata oluştu',
      };
    }
  }

  async update(id: string, updatePrinterDto: UpdatePrinterDto) {
    try {
      const { printerIp } = updatePrinterDto;

      if (printerIp) {
        const existing = await this.printerModel.findOne({
          printerIp,
          _id: { $ne: id },
        });

        if (existing) {
          return {
            status: false,
            message: 'Bu IP başka bir yazıcıda kayıtlı',
            data: existing,
          };
        }
      }

      const updated = await this.printerModel.findByIdAndUpdate(
        id,
        updatePrinterDto,
        { new: true }
      );

      if (!updated) {
        return {
          status: false,
          message: 'Yazıcı bulunamadı',
        };
      }

      return {
        status: true,
        message: 'Yazıcı güncellendi',
        data: updated,
      };
    } catch (error: unknown) {
      this.logError('PrinterService.update', error);

      return {
        status: false,
        message: 'Güncelleme sırasında hata oluştu',
      };
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.printerModel.findByIdAndDelete(id);

      if (!deleted) {
        return {
          status: false,
          message: 'Yazıcı bulunamadı',
        };
      }

      return {
        status: true,
        message: 'Yazıcı silindi',
        data: deleted,
      };
    } catch (error: unknown) {
      this.logError('PrinterService.remove', error);

      return {
        status: false,
        message: 'Silme sırasında hata oluştu',
      };
    }
  }
}