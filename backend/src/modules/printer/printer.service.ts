import { Model } from "mongoose";
import { CreatePrinterDto, printAdisyonDto } from "./dto/create-printer.dto";
import { UpdatePrinterDto } from "./dto/update-printer.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MyLogger } from "../../shared/logger/logger.service";
import { Printer } from "../../schemas/Printer.schemas";
import { PrintingService } from "../../shared/printing/printing.service";
import { Order } from "../../schemas/Order.schemas";
import { Table } from "../../schemas/table.schemas";

@Injectable()
export class PrinterService {
  constructor(
    private readonly logger: MyLogger,
    @InjectModel(Printer.name) private printerModel: Model<Printer>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    private readonly printingService: PrintingService

  ) { }

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

  async printAdisyon(printAdisyonDto: printAdisyonDto) {
    try {

      const order = await this.orderModel.findById(printAdisyonDto.orderId)
        .populate({
          path: 'orderItems',
          model: 'OrderItem',
          populate: {
            path: 'foodId',
            model: 'Food'
          }
        })
        .exec();

      if (!order) return { status: false, message: "Sipariş Bulunamadı" };
      const printer = await this.printerModel.findById(printAdisyonDto.printerId)
      if (!printer) return { status: false, message: "Yazıcı bilgilerine ulasılamadı" };
      
      //console.log(order)
      const table = await this.tableModel.findById(order.tableId);
      if (!table) return { status: false, message: "Masa Bulunamadı" };

      const printData = {
        orderNo: order._id.toString().slice(-4),
        tableName: table.name,
        date: order.createdAt,
        items: order.orderItems.map((item: any) => ({
          name: item.foodId?.name || 'Bilinmeyen Ürün',
          qty: Number(item.qty),
          price: Number(item.unitprice),
          total: Number(item.total)
        })),
        totalAmount: Number(order.total) as number
      };
      // TODO burada axios ile diger servi 
      const status = await this.printingService.printData(printer.printerIp, printer.printerType, printData);
      if (true)
        return { message: "basral sekilde yazdırıldı " }
      else
        return { status: false, message: "yazdırma işleminde hat olustur " }
    } catch (error: any) {
      console.error('PrintData Hatası:', error);
      this.logger.error(`Order PrintOrder Hatası: -Gelen ID ${printAdisyonDto.orderId} -  Hata: ${error.message}`, error.stack)


      throw new InternalServerErrorException('Sipariş yazdırılırken hata olustu ');
    }
  }
}