import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from 'src/schemas/table.schemas';
import { Model } from 'mongoose';
import { Order } from 'src/schemas/Order.schemas';
import { OrderItem } from 'src/schemas/OrderItem.schemas';
import { User } from 'src/schemas/User.schemas';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }
  async create(createTableDto: CreateTableDto) {
    try {
      const { name } = createTableDto
      const newTable = new this.tableModel({
        name,
        status: "bos",
        currentOrderId: null,
      });

      await newTable.save();

      return newTable;
    } catch (error) {
      console.error("Table Create Hatası:", error); // Hatayı konsolda gör
      throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
    }
  }

  async findAll() {
    try {
      const tables = await this.tableModel.find();
      const result: any[] = [];

      for (const table of tables) {
        let orderCreated: string | null = null;
        let createdAt: Date | null = null;
        let orderTotal: number | null = null;
        let waiterName: string | null = null;

        if (table.status === "dolu" && table.currentOrderId) {
          const order = await this.orderModel.findById(table.currentOrderId);

          if (order) {
            createdAt = new Date(order.createdAt);

            const hours = createdAt.getHours().toString().padStart(2, "0");
            const minutes = createdAt.getMinutes().toString().padStart(2, "0");

            orderCreated = `${hours}:${minutes}`;
            orderTotal = order.total;

            const waiter = await this.userModel
              .findById(order.waiterId)
              .select("firstName");

            waiterName = waiter?.firstName ?? "bilinmiyor";
          }
        }

        result.push({
          _id: table._id,
          name: table.name,
          status: table.status,
          currentOrderId: table.currentOrderId || null,
          // locationId: table.locationId,
          waiterName,
          orderCreated,
          orderTotal,
        });
      }

      return {status:true,data:result};
    } catch (error) {
      console.error("Table  FindAll Hatası:", error); // Hatayı konsolda gör
      throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
    }
  }

  async findOne(id: string) {
    try {
      const table = await this.tableModel.findById(id);

      if (!table) {
        throw new HttpException(
          {
            success: false,
            message: "Masa bulunamadı",
          },
          HttpStatus.OK, // İsteğin üzerine 200 OK dönüyoruz
        );
      }

      // masa boşsa
      if (!table.currentOrderId) {
        return {
          success: true,
          data: {
            _id: table._id,
            name: table.name,
            status: table.status,
            adisyon: null,
          },
        };
      }

      // order
      const order = await this.orderModel.findById(table.currentOrderId);

      if (!order) {
        return {
          success: true,
          data: {
            _id: table._id,
            name: table.name,
            status: table.status,
            adisyon: null,
          },
        };
      }

      // order items + populate
      const orderItems = await this.orderItemModel
        .find({ _id: { $in: order.orderItems } })
        .populate("foodId", "name price");

      const items = orderItems.map((item: any) => ({
        foodId: item.foodId?._id,
        qty: item.qty,
        price: item.foodId?.price,
        name: item.foodId?.name,
      }));

      return {
        success: true,
        data: {
          _id: table._id,
          name: table.name,
          status: table.status,
          adisyon: items,
        },
      };
    } catch (error) {
      console.error("Table FindOne Hatası:", error); // Hatayı konsolda gör
      throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
    }
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    try {
      const { name } = updateTableDto;

      const updated = await this.tableModel.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );

      if (!updated) {
        throw new HttpException(
          {
            success: false,
            message: "Masa bulunamadı",
          },
          HttpStatus.OK, // İsteğin üzerine 200 OK dönüyoruz
        );
      }

      return {
        success: true,
        data: updated,
      };
    } catch (error) {
      console.error("Table Update Hatası:", error); // Hatayı konsolda gör
      throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
    }
  }

  async remove(id: string) {
    try {
      const removed = await this.tableModel.findByIdAndDelete(id);

      if (!removed) {
        throw new HttpException(
          {
            success: false,
            message: "Masa bulunamadı",
          },
          HttpStatus.OK, // İsteğin üzerine 200 OK dönüyoruz
        );
      }

      return {
        success: true,
        message: "Masa silindi",
      };

    } catch (error) {
      console.error("Table Remove Hatası:", error); // Hatayı konsolda gör
      throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
    }
  }
  async reassignTables(body: {
    oldTableId: string;
    newTableId: string;
    orderId: string;
  }) {
    try {
      const { oldTableId, newTableId, orderId } = body;

      if (!oldTableId || !newTableId || !orderId) {
        throw new HttpException(
          {
            success: false,
            message: "Eksik parametre",
          },
          HttpStatus.OK);
      }

      const oldTable = await this.tableModel.findById(oldTableId);
      const newTable = await this.tableModel.findById(newTableId);

      if (!oldTable || !newTable) {
        throw new HttpException({
          success: false,
          message: "Masalardan biri bulunamadı",
        }, HttpStatus.OK);
      }

      // Order masa değiştir
      await this.orderModel.findByIdAndUpdate(orderId, {
        tableId: newTableId,
      });

      // Eski masa boşalt
      await this.tableModel.findByIdAndUpdate(oldTableId, {
        status: "bos",
        currentOrderId: null,
      });

      // Yeni masa doldur
      await this.tableModel.findByIdAndUpdate(newTableId, {
        status: "dolu",
        currentOrderId: orderId,
      });

      return {
        success: true,
        message: "Masa başarılı şekilde değiştirildi",
      };

    } catch (error) {
      console.error("Table ReassignTable Hatası:", error); // Hatayı konsolda gör
      throw error; // Hatayı NestJS'e fırlat ki istemciye hata kodu gitsin
    }
  }

 
  


}
