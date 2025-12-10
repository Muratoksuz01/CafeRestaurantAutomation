const User = require('../../models/User');
const Order = require('../../models/Order');
const Food = require('../../models/foods');
const OrderItems = require('../../models/OrderItem');





const getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);


    const incomeAgg = await Order.aggregate([{ $match: { createdAt: { $gte: monthStart, $lte: monthEnd }, isClosed: true } },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$total" }
      }
    }
    ]);

    const totalIncome = incomeAgg[0]?.totalIncome || 0;

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
          createdAt: { $gte: monthStart, $lte: monthEnd },
          isClosed: true
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          total: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthlySalesChart = chartAgg.map((c) => ({
      day: c._id.toString().padStart(2, "0"),
      total: c.total
    }));


    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

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
const giveAproach = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = true;
  await user.save();

  return res.json({ success: true, message: "User approved" });
};
const giveReject = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = false;
  await user.save();

  return res.json({ success: true, message: "User rejected" });
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  await User.findByIdAndDelete(id);

  return res.json({ success: true, message: "User deleted" });
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      isActive: { $in: [false, null, true] }
    }).select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {
  getUsers,
  giveAproach,
  deleteUser,
  giveReject,
  getAdminStats
};