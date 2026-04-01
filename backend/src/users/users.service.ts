import { HttpException, HttpStatus, Injectable, Delete, Param, Body, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/User.schemas';
import { UpdateUser } from './dto/UpdateUser';
import { CreateUser } from './dto/CreateUser.dto';
import { UserRole } from 'src/schemas/UserRole.schemas';
import { Order } from 'src/schemas/Order.schemas';
import { OrderItem } from 'src/schemas/OrderItem.schemas';
import { Food } from 'src/schemas/Food.schemas';
import { Role } from 'src/schemas/Role.schemas';
import { MyLogger } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    @InjectModel(Food.name) private foodModel: Model<Food>,
    private readonly logger:MyLogger,
  ) { 
    this.logger.setContext("UsersService")
  }

  async getAdminStats(req: any) {
    // TODO
    const currentUserId = req.user.userId
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const incomeAgg = await this.orderModel.aggregate([
        {
          $match: {
            status: "tamamlandi",
            createdAt: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$total" }
          }
        }
      ]);

      const totalIncome = incomeAgg.length ? incomeAgg[0].totalIncome : 0;

      // -----------------------------------
      // 2) En çok satılan yemek (OrderItems)
      // -----------------------------------
      const topFoodAgg = await this.orderItemModel.aggregate([
        {
          $group: {
            _id: "$foodId", count: { $sum: "$qty" }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);

      let topFood: any = null;

      if (topFoodAgg.length > 0) {
        const food = await this.foodModel.findById(topFoodAgg[0]._id);
        topFood = {
          name: food?.name || "Bilinmiyor",
          count: topFoodAgg[0].count
        };
      }

      // -----------------------------------
      // 3) Aylık günlük kazanç grafiği
      // -----------------------------------
      const chartAgg = await this.orderModel.aggregate([
        {
          $match: {
            status: "tamamlandi",
            createdAt: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            total: { $sum: "$total" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const monthlySalesChart = chartAgg.map(c => ({
        day: String(c._id).padStart(2, "0"),
        total: c.total
      }));


      const totalUsers = await this.userModel.countDocuments({ _id: { $ne: currentUserId } });
      const totalAdmins = await this.userModel.countDocuments({ role: "Yonetici" });

      const foodCount = await this.foodModel.countDocuments();

      const data = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            total: { $sum: "$total" }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);
      const result = data.map(d => ({
        day: d._id.toString(),
        total: d.total
      }));
      return {
        data: {
          chart: result,
          totalIncome,
          topFood,
          monthlySalesChart,
          userStats: {
            totalUsers,
            totalAdmins
          },
          foodCount
        }
      }

    } catch (error) {
      console.error("User GetAdminStats Hatası:", error);
      this.logger.error(`User GetAdminStats Hatası: User:${currentUserId} - Hata: ${error.message}`,error.stack)
      throw new InternalServerErrorException('Kullanıcı getadminstats teknik bir hata oluştu.');
    }
  }

  async deleteUser(id: string) {
    // TODO
    try {
      const user = await this.userModel.findById(id)
      if (!user) throw new HttpException({ status: false, message: "User bulunamadı", }, HttpStatus.OK,);
      await this.userModel.findByIdAndDelete(id)
      return { status: true, message: "User Deleted" }
    } catch (error) {
      console.error("User Delete Hatası:", error);
      this.logger.error(`User Delete Hatası: Gelen Id:${id} - Hata: ${error.message}`,error.stack)

      throw new InternalServerErrorException('Kullanıcı silinirken teknik bir hata oluştu.');
    }
  }

  async updateUser(id: string, updateUser: UpdateUser) {
    // TODO
    try {
      const userId = id
      const { email, firstName, lastName, phoneNumber, roleName, isActive } = updateUser
      const user = await this.userModel.findById(userId)
      if (!user) throw new HttpException({ status: false, message: "User bulunamadı", }, HttpStatus.OK,);
      // 2️⃣ User alanlarını güncelle
      user.firstName = firstName
      user.lastName = lastName
      user.email = email
      user.phoneNumber = phoneNumber
      user.isActive = isActive

      await user.save()
      const role = await this.roleModel.findOne({ name: roleName })
      if (!role) throw new HttpException({ status: false, message: "Role bulunamadı", }, HttpStatus.OK,);
      await this.userRoleModel.findOneAndUpdate(
        { userId: user._id },
        { roleId: role._id },
        { new: true }// bu foks her turlu bir doc donuyor burası true olursa update sonrası doc doner false olsursa before update olur
      )

      return { status: true, message: "Kullanıcı güncellendi" }
    } catch (error) {
      console.error("User Update Hatası:", error);
      this.logger.error(`User Update Hatası: Gelen Id:${id} -Data:${JSON.stringify(updateUser)} -  Hata: ${error.message}`,error.stack)

      throw new InternalServerErrorException('Kullanıcı guncellenirken teknik bir hata oluştu.');
    }
  }

  async getUser(id: string) {
    // TODO
    try {
      const user = await this.userModel.findById(id).select("-password").lean();
      if (!user) return ({ status: false, message: "User bulunamadı", });
      const userRole = await this.userRoleModel
        .findOne({ userId: user._id })
        .populate("roleId", "name");

      const role = userRole?.roleId as any;

      // role -> permissions

      return {
        status: true,
        data: {
          ...user,
          roleName: role.name
        }
      }
    } catch (error) {
      console.error("User GetUser Hatası:", error);
      this.logger.error(`User GetUser Hatası: Gelen Id:${id} -  Hata: ${error.message}`,error.stack)

      throw new InternalServerErrorException('Kullanıcı guncegetirilirkenllenirken teknik bir hata oluştu.');
    }
  }

  async getUsers(req: any) {
    const currentUserId = req.user.userId;
    try {

      // 1. .lean() ekleyerek saf JS nesnesi alıyoruz
      const users = await this.userModel
        .find({ _id: { $ne: currentUserId } })
        .select('-password')
        .lean();

      const result = await Promise.all(
        users.map(async (user) => {
          const userRole = await this.userRoleModel
            .findOne({ userId: user._id })
            .populate('roleId', 'name')
            .lean();

          const role = userRole?.roleId as any;

          return {
            _id: user._id.toString(), // ID'yi string'e çevirmek Zod için daha güvenli
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isActive: user.isActive,
            roleName: role?.name || 'Rol Atanmamış',
          };
        }),
      );

      return { status: true, data: result };
    } catch (error) {
      console.error("User GetUsers Hatası:", error);
      this.logger.error(`User GetUsers Hatası: Gelen Id:${currentUserId} -  Hata: ${error.message}`,error.stack)

      throw new InternalServerErrorException('Kullanıcılar getirlirken teknik bir hata oluştu.');
    }
  }

  async getRoles() {
    // TODO
    try {
      const actions = await this.userRoleModel.find().select("_id name");
      return { status: true, data: actions }
    } catch (error) {
      console.error("User GetRoles Hatası:", error);
      this.logger.error(`User GetRoles Hatası -  Hata: ${error.message}`,error.stack)


      throw new InternalServerErrorException('Kullanıcı roller getirlirken teknik bir hata oluştu.');
    }

  }

  async createUser(createUser: CreateUser) {
    // TODO
    try {
      const { firstName, lastName, email, phoneNumber, password, roleName, isActive } = createUser;
      const role = await this.roleModel.findOne({ name: roleName });
      if (!role) return ({ status: false, message: "Role bulunamadı", });
      const user = await this.userModel.create({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        isActive
      });

      await this.userRoleModel.create({
        userId: user._id,
        roleId: role._id
      });
      return { status: true }
    } catch (error) {
      console.error("User CreateUser Hatası:", error);
      this.logger.error(`User CreateUser Hatası: Data:${JSON.stringify(createUser)} -  Hata: ${error.message}`,error.stack)


      throw new InternalServerErrorException('Kullanıcı olusturulurken teknik bir hata oluştu.');
    }
  }

  async updateProfile(userId: string, data: any) {
    try {
      const { email, firstName, lastName, phoneNumber } = data
      const user = await this.userModel.findById(userId)
      if (!user) return { status: false, message: "User bulunamadı", };
      // 2️⃣ User alanlarını güncelle
      user.firstName = firstName
      user.lastName = lastName
      user.email = email
      user.phoneNumber = phoneNumber
      await user.save()
      return {
      //status: true,
      message: "Profil güncellendi"
    };
    } catch (error) {
      console.error("User updateProfile Hatası:", error);
      this.logger.error(`User updateProfile Hatası: Gelen Id:${userId} -Data:${JSON.stringify(data)} -  Hata: ${error.message}`,error.stack)


      throw new InternalServerErrorException('Kullanıcı profili guncellenirken teknik bir hata oluştu.');

    }
  }
  async updateProfilePassword(userId: string, data: any) {
    try {
      const { currentPassword, newPassword } = data
      const user = await this.userModel.findById(userId).select("+password") as UserDocument
      if (!user) return { status: false, message: "User bulunamadı", };
      const passCorrect = await user.comparePassword(currentPassword);

      if (!passCorrect) {
        return { status: false, message: "Mevcut şifre yanlış" };
      }

      const isSame = await user.comparePassword(newPassword);
      if (isSame) {
        return { status: false, message: "Yeni şifre eskiyle aynı olamaz" };
      }

      user.password = newPassword;
      await user.save();

      return {
        status: true,
        message: "Şifre başarıyla güncellendi"
      };

    } catch (error) {
      console.error("User updateProfilePassword Hatası:", error);
      this.logger.error(`User updateProfilePassword Hatası: Gelen Id:${userId} -Data:${JSON.stringify(data)} -  Hata: ${error.message}`,error.stack)


      throw new InternalServerErrorException('Kullanıcı  isfresi guncellenirken teknik bir hata oluştu.');

    }
  }

}