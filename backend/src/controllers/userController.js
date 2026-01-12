const User = require('../models/User');
const Order = require('../models/Order');
const Food = require('../models/foods');
const Role = require('../models/Role');
// const Action = require('../../models/action');
const OrderItems = require('../models/OrderItem');
const UserRole = require('../models/UserRole');
// const RoleAction = require('../../models/RoleAction');





exports.getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const currentUserId = req.user.id;

    const incomeAgg = await Order.aggregate([
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
    const topFoodAgg = await OrderItems.aggregate([
      {
        $group: {
          _id: "$foodId", count: { $sum: "$qty" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let topFood = null;

    if (topFoodAgg.length > 0) {
      const food = await Food.findById(topFoodAgg[0]._id);
      topFood = {
        name: food?.name || "Bilinmiyor",
        count: topFoodAgg[0].count
      };
    }

    // -----------------------------------
    // 3) Aylık günlük kazanç grafiği
    // -----------------------------------
   const chartAgg = await Order.aggregate([
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


    const totalUsers = await User.countDocuments({ _id: { $ne: currentUserId } });
    const totalAdmins = await User.countDocuments({ role: "Yonetici" });

    const foodCount = await Food.countDocuments();

    const data = await Order.aggregate([
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

    res.json({
      success: true,
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
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ success: false, message: "Admin stats failed", error });
  }
};
/* const giveAproach = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = true;
  await user.save();

  return res.json({ success: true, message: "User approved" });
}; */
/* const giveReject = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = false;
  await user.save();

  return res.json({ success: true, message: "User rejected" });
}; */
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  await User.findByIdAndDelete(id);

  return res.json({ success: true, message: "User deleted" });
};
exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false });

    // user -> role
    const userRole = await UserRole
      .findOne({ userId: user._id })
      .populate("roleId", "name");

    const roleName = userRole?.roleId?.name;

    // role -> permissions
    const roleActions = await RoleAction
      .find({ roleId: userRole?.roleId?._id })
      .populate("actionId", "code");

    const permissions = roleActions.map(r => ({
      id: r.actionId._id,
      //   code: r.actionId.code,
    }));
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        roleName,
        permissions
      }
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false });
  }
};
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, roleName, isActive } = req.body;
    if (!roleName) {
      return res.status(400).json({ success: false, message: "Rol seçilmelidir" });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ success: false, message: "Geçersiz rol" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      isActive
    });

    await UserRole.create({
      userId: user._id,
      roleId: role._id
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "kullanıcı olusturlamdı" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // 1. İstekte bulunan kullanıcının ID'sini al (Middleware'den gelir)
    const currentUserId = req.user.id;

    // 2. Veritabanından çekilirken filtreleme yap ($ne: "not equal")
    // Şifreyi dahil etmiyoruz
    const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");

    const result = await Promise.all(
      users.map(async (user) => {
        const userRole = await UserRole
          .findOne({ userId: user._id })
          .populate("roleId", "name");

        return {
          ...user.toObject(),
          roleName: userRole?.roleId?.name || "Rol Atanmamış"
        };
      })
    );

    res.json({ success: true, data: result });

  } catch (err) {
    console.error("getUsers Hatası:", err);
    res.status(500).json({ success: false, message: "Kullanıcılar getirilemedi." });
  }
};
exports.getRoles = async (req, res) => {
  try {
    const actions = await Role.find().select("_id name");

    res.status(200).json({
      success: true,
      data: actions
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false });
  }
}

/* exports.getPermissions = async (req, res) => {
  try {
    const actions = await Action.find().select("_id code description");

    res.status(200).json({
      success: true,
      data: actions
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false });
  }
}; */
/* exports.updatePermission = async (req, res) => {
  try {
    const userId = req.params.id;       // kullanıcı id
    const { ids } = req.body;           // actionId[] (string)

    // kullanıcının rolü
    const userRole = await UserRole.findOne({ userId });
    if (!userRole) {
      return res.status(404).json({ success: false, message: "Role bulunamadı" });
    }

    const roleId = userRole.roleId;

    // role ait tüm actionları sil
    await RoleAction.deleteMany({ roleId });

    // yeni actionları ekle
    const roleActions = ids.map(actionId => ({
      roleId,
      actionId
    }));

    await RoleAction.insertMany(roleActions);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}; */

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const { email, firstName, lastName, phoneNumber, roleName, isActive } = req.body

    // 1️⃣ Kullanıcıyı bul
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" })
    }

    // 2️⃣ User alanlarını güncelle
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.phoneNumber = phoneNumber
    user.isActive = isActive

    await user.save()

    // 3️⃣ RoleName → RoleId
    const role = await Role.findOne({ name: roleName })
    if (!role) {
      return res.status(400).json({ success: false, message: "Rol bulunamadı" })
    }

    // 4️⃣ UserRole tablosunda role güncelle
    await UserRole.findOneAndUpdate(
      { userId: user._id },
      { roleId: role._id },
      { new: true }// bu foks her turlu bir doc donuyor burası true olursa update sonrası doc doner false olsursa before update olur
    )

    return res.json({ success: true, message: "Kullanıcı güncellendi" })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Sunucu hatası" })
  }
}

exports.totallydelete = async (req, res) => {

}