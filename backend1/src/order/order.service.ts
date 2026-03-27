import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/schemas/Order.schemas';
import { OrderItem } from 'src/schemas/OrderItem.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from 'src/schemas/table.schemas';
import { Model } from 'mongoose';
import { Rezerve } from 'src/schemas/Rezerve.schemas';
import { PrinterService } from 'src/Printer/printer.service';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    @InjectModel(Rezerve.name) private rezerveModel: Model<Rezerve>,
    private readonly printerService: PrinterService


  ) { }
  async create(req: any, createOrderDto: CreateOrderDto) {
    const { tableId, basket, total } = createOrderDto;
    const userId = req.user.userId; // JwtStrategy'den gelen userId

    // 1. Masanın varlığını ve durumunu kontrol et (Senior Check)
    const table = await this.tableModel.findById(tableId);
    if (!table) {
      return { success: false, message: 'Masa bulunamadı.' };
    }
    if (table.status == "rezerve") {
      const rezerve = await this.rezerveModel.findOne({ masaId: table._id })
      if (!rezerve) {
        return { success: false, message: 'Rezervasyon bulunamadı.' };
      }
      rezerve.status = "arrived"
      await rezerve.save()
    }

    try {
      // 2. Yeni Siparişi (Order) oluştur
      const newOrder = new this.orderModel({
        tableId,
        total,
        status: 'hazirlaniyor',
        waiterId: userId,
        orderItems: [], // Şimdilik boş, birazdan ID'leri ekleyeceğiz
      });

      const savedOrder = await newOrder.save();

      // 3. Sepetteki ürünleri (Basket) OrderItem dökümanlarına dönüştür
      const itemsToSave = basket.map((item) => ({
        foodId: item._id,
        orderId: savedOrder._id,
        qty: item.qty,
        unitprice: item.price,
        total: item.qty * item.price,
      }));

      const createdItems = await this.orderItemModel.insertMany(itemsToSave);

      // 4. Oluşturulan Item ID'lerini Order'a geri yaz ve güncelle
      const itemIds = createdItems.map((i) => i._id);
      savedOrder.orderItems = itemIds as any; // Cast işlemi gerekebilir
      await savedOrder.save();

      // 5. Masayı güncelle (Durum: dolu ve Aktif Sipariş ID'si)
      await this.tableModel.findByIdAndUpdate(tableId, {
        status: 'dolu',
        currentOrderId: savedOrder._id,
      });
      await this.printerService.printOrder({
        orderId: savedOrder._id,
        tableId: tableId,
        items: basket.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price
        })),
        totalAmount:total
      })
      // 6. Sonucu döndür (Interceptor sayesinde otomatik paketlenecek)
      return {
        message: 'Sipariş başarıyla oluşturuldu.',
        data: {
          order: savedOrder,
          items: createdItems,
        },
      };
    } catch (error) {
      console.error('Sipariş Oluşturma Hatası:', error);
      throw new InternalServerErrorException('Sipariş oluşturulurken bir hata meydana geldi.');
    }
  }

  async findAll(from?: string, to?: string) {
    try {
      // 1. Günün başlangıç ve bitiş saatlerini ayarla (Senior Date Management)
      let start: Date;
      let end: Date;
      if (from && to) {
        start = new Date(from);
        end = new Date(to);
        end.setHours(23, 59, 59, 999); // Günü son saniyesine kadar kapsa
      } else {
        start = new Date();
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setHours(23, 59, 59, 999);
      }
      // 2. Sorguyu oluştur ve ilişkili dökümanları çek
      const orders = await this.orderModel
        .find({
          createdAt: {
            $gte: start,
            $lte: end,
          },
        })
        .populate('tableId', 'name') // Sadece masa adını getir
        .populate('waiterId', 'firstName lastName') // Sadece garson adını ve soyadını getir
        .sort({ createdAt: -1 })
        .lean(); // Performans için düz JS nesnesine çevirir

      // 3. Veriyi Frontend'in (Zod şemanın) beklediği formata dönüştür
      const result = orders.map((o) => ({
        id: o._id.toString(),
        tableName: (o.tableId as any)?.name || 'Bilinmeyen Masa',
        orderTotal: o.total,
        status: o.status,
        waiterName: o.waiterId
          ? `${(o.waiterId as any).firstName} ${(o.waiterId as any).lastName}`
          : 'Sistem',
        orderDate: o.createdAt,
      }));

      // Interceptor sayesinde { success: true, data: result } olarak paketlenecek
      return result;
    } catch (error) {
      console.error('Order FindAll Hatası:', error);
      throw new InternalServerErrorException('Sipariş listesi alınamadı.');
    }
  }

  async findOne(id: string) {
    try {
      // 1. Derinlemesine (Nested) Populate işlemi
      const order = await this.orderModel
        .findById(id)
        .populate('tableId', 'name') // Masanın adını getir
        .populate('waiterId', 'firstName lastName') // Garsonun adını getir
        .populate({
          path: 'orderItems',
          populate: {
            path: 'foodId',
            select: 'name imgs', // Ürünün adı ve görsellerini getir
          },
        })
        .lean();

      // 2. Sipariş bulunamadıysa hata fırlat (Senior Error Handling)
      if (!order) {
        // Interceptor kullanmasaydık return { success: false } derdik
        // Ama NestJS yapısında NotFoundException fırlatmak daha standarttır
        throw new NotFoundException('Sipariş bulunamadı.');
      }

      // 3. Veriyi Frontend'in kolayca tüketebileceği formata getir
      const result = {
        id: order._id.toString(),
        tableName: (order.tableId as any)?.name || 'Bilinmeyen Masa',
        orderTotal: order.total,
        status: order.status,
        waiterName: order.waiterId
          ? `${(order.waiterId as any).firstName} ${(order.waiterId as any).lastName}`
          : 'Sistem',
        orderDate: order.createdAt,
        orderItems: (order.orderItems as any[]).map((item) => ({
          foodName: item.foodId?.name || 'Silinmiş Ürün',
          qty: item.qty,
          unitPrice: item.unitprice,
          total: item.total,
          img: item.foodId?.imgs?.[0] || null, // İlk resmi al, yoksa null dön
        })),
      };

      return { status: true, data: result }; // Interceptor bunu { success: true, data: result } yapacaktır.
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Order FindOne Hatası:', error);
      throw new InternalServerErrorException('Sipariş detayı alınırken bir hata oluştu.');
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      // sadece ascı rolu icin kullanılıyor
      const order = await this.orderModel.findByIdAndUpdate(
        id,
        { $set: { status: 'tamamlandi' } },
        { new: true }
      ).lean();

      if (!order) {
        return { status: false, message: 'Sipariş bulunamadı.' };
      }



      return {
        message: 'Sipariş durumu güncellendi.',
        data: order
      };
    } catch (error) {
      console.error('Order Update Hatası:', error);
      throw new InternalServerErrorException('Sipariş güncellenirken bir hata oluştu.');
    }
  }
  async editOrder(updateOrderDto: UpdateOrderDto) {
    const { orderId, basket, total } = updateOrderDto;

    try {
      const order = await this.orderModel.findById(orderId);
      if (!order) {
        return { success: false, message: 'Düzenlenecek adisyon bulunamadı.' };
      }

      await this.orderItemModel.deleteMany({ orderId });

      const itemsToSave = basket.map((item) => ({
        foodId: item._id,
        orderId: orderId,
        qty: item.qty,
        unitprice: item.price,
        total: item.qty * item.price,
      }));

      const createdItems = await this.orderItemModel.insertMany(itemsToSave);

      const newItemIds = createdItems.map((i) => i._id);

      order.total = Number(total) || 0;
      order.orderItems = newItemIds as any;
      const updatedOrder = await order.save();

      return {
        message: 'Sipariş başarıyla güncellendi.',
        data: updatedOrder,
      };
    } catch (error) {
      console.error('EditOrder Hatası:', error);
      throw new InternalServerErrorException('Sipariş güncellenirken teknik bir hata oluştu.');
    }
  }
  async remove(id: string) {
    try {
      // 1. Sipariş var mı kontrol et
      const order = await this.orderModel.findById(id);
      if (!order) {
        return { success: false, message: 'Adisyon bulunamadı.' };
      }

      // 2. Siparişe bağlı kalemleri (OrderItems) sil
      if (order.orderItems && order.orderItems.length > 0) {
        await this.orderItemModel.deleteMany({ _id: { $in: order.orderItems } });
      }

      // 3. Masayı özgür bırak (Status: bos, currentOrderId: null)
      // Siparişteki tableId'yi kullanmak daha garanti bir yoldur
      await this.tableModel.findByIdAndUpdate(order.tableId, {
        $set: {
          status: 'bos',
          currentOrderId: null,
        },
      });

      // 4. Ana sipariş kaydını sil
      await this.orderModel.findByIdAndDelete(id);

      return { success: true, message: 'Adisyon ve bağlı tüm veriler silindi.' };
    } catch (error) {
      console.error('Order Remove Hatası:', error);
      throw new InternalServerErrorException('Silme işlemi sırasında sunucu hatası oluştu.');
    }
  }
  async getPaid(updateOrderDto: UpdateOrderDto) {
    const { orderId, tableId } = updateOrderDto;

    // 1. Girdi Kontrolü (Zaten DTO'da class-validator ile yapılmalı ama servis içinde de bakıyoruz)
    if (!orderId || !tableId) {
      return { success: false, message: 'Geçersiz sipariş veya masa bilgisi.' };
    }

    try {
      // 2. Siparişi bul
      const order = await this.orderModel.findById(orderId);
      if (!order) {
        return { success: false, message: 'Sipariş (Adisyon) bulunamadı.' };
      }

      // 3. Idempotency Check: Zaten ödenmişse işlem yapma
      if (order.status === 'tamamlandi') {
        return { success: false, message: 'Bu adisyon zaten kapatılmış ve ödemesi alınmış.' };
      }

      // 4. Sipariş Durumunu Güncelle
      order.status = 'tamamlandi';
      // Opsiyonel: Buraya paymentMethod (Nakit/Kredi Kartı) alanı eklenebilir
      await order.save();

      // 5. Masayı Boşalt (Status: bos, currentOrderId: null)
      // Senior Notu: findByIdAndUpdate yerine doğrudan order içindeki tableId'yi de kullanabilirsin
      await this.tableModel.findByIdAndUpdate(tableId, {
        $set: {
          status: 'bos',
          currentOrderId: null,
        },
      });

      return {
        success: true,
        message: 'Ödeme başarıyla alındı ve masa boşaltıldı.',
        data: { orderId: order._id }
      };
    } catch (error) {
      console.error('getPaid Hatası:', error);
      throw new InternalServerErrorException('Ödeme işlemi sırasında teknik bir hata oluştu.');
    }
  }

  // async getOrderByDate(from?: string, to?: string) {
  //   try {
  //     // 1. Tarihleri nesneye çevir ve geçerliliğini kontrol et
  //     const startDate = new Date(from);
  //     const endDate = new Date(to);

  //     endDate.setHours(23, 59, 59, 999);

  //     // 2. Veritabanı sorgusu
  //     const orders = await this.orderModel
  //       .find({
  //         createdAt: {
  //           $gte: startDate,
  //           $lte: endDate,
  //         },
  //       })
  //       .populate('waiterId', 'firstName lastName')
  //       .populate('tableId', 'name')
  //       .sort({ createdAt: -1 })
  //       .lean(); // Performans için düz JS nesnesi

  //     // 3. Veriyi Frontend dostu (Zod şemasına uygun) hale getir
  //     const result = orders.map((o) => ({
  //       id: o._id.toString(),
  //       tableName: (o.tableId as any)?.name || 'Bilinmeyen Masa',
  //       orderTotal: o.total,
  //       status: o.status,
  //       waiterName: o.waiterId
  //         ? `${(o.waiterId as any).firstName} ${(o.waiterId as any).lastName}`
  //         : 'Sistem',
  //       orderDate: o.createdAt,
  //     }));

  //     return { status: true, data: result }; // Interceptor bunu { success: true, data: result } yapacaktır.
  //   } catch (error) {
  //     console.error('getOrderByDate Hatası:', error);
  //     throw new InternalServerErrorException('Belirtilen tarihler arasında rapor alınamadı.');
  //   }
  // }




}
