const Tables = require("../models/Table");
const Order = require("../models/Order");
const OrderItems = require("../models/OrderItem");


exports.createOrder = async (req, res) => {
  try {
    const { tableId, basket, total, } = req.body;
    const userId = req.user.id
    // 1) Yeni Order oluştur
    const newOrder = new Order({
      tableId,
      total,
      status: "hazirlaniyor",
      orderItems: [],
      waiterId: userId,
    });

    const savedOrder = await newOrder.save();

    // 2) Basket -> OrderItems kaydet
    const itemsToSave = basket.map((b) => ({
      foodId: b._id,
      orderId: savedOrder._id,
      qty: b.qty,
      unitprice: b.price,
      total: b.qty * b.price
    }));

    const createdItems = await OrderItems.insertMany(itemsToSave);

    // 3) Bu item’ların ID’lerini Order’a ekle
    savedOrder.orderItems = createdItems.map((i) => i._id);
    await savedOrder.save();

    // 4) Masayı güncelle (dolu + currentOrderId)
    await Tables.findByIdAndUpdate(tableId, {
      status: "dolu",
      currentOrderId: savedOrder._id
    });

    res.json({
      success: true,
      data: savedOrder,
      items: createdItems
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.editOrder = async (req, res) => {
  try {
    const { tableId, basket, total, orderId } = req.body;

    if (!orderId) {
      return res.status(204).json({ success: false, message: "orderId gerekli" });
    }

    // 1) Order var mı kontrol
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(204).json({ success: false, message: "Order bulunamadı" });
    }

    // 2) Eski OrderItems sil
    await OrderItems.deleteMany({ orderId });

    // 3) Yeni OrderItems ekle
    const newItems = [];

    for (const item of basket) {
      const created = await OrderItems.create({
        foodId: item._id,          // frontend item._id = foodId
        orderId,
        qty: item.qty,
        unitprice: item.price,
        total: item.qty * item.price
      });
      newItems.push(created._id);
    }

    // 4) Order güncelle
    order.total = total;
    order.orderItems = newItems;
    await order.save();

    return res.json({
      success: true,
      message: "Order başarıyla güncellendi",
      order
    });

  } catch (error) {
    console.log("editOrder error:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(200).json({ success: false, message: "orderId gerekli" });
    }

    // Order var mı?
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(200).json({ success: false, message: "Adisyon bulunamadı" });
    }
    // OrderItems varsa sil
    if (order.orderItems && order.orderItems.length > 0) {
      await OrderItems.deleteMany({ _id: { $in: order.orderItems } });
    }
    await Tables.findOneAndUpdate(
      { currentOrderId: orderId },
      {
        $set: {
          status: "bos",
          currentOrderId: null
        }
      }
    );
    // Adisyonu sil
    await Order.findByIdAndDelete(orderId);

    return res.status(200).json({ success: true, message: "Adisyon silindi" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};
exports.getPaid = async (req, res) => {
  try {
    const { tableId, basket, total, orderId } = req.body;

    if (!tableId || !orderId || !basket || !Array.isArray(basket)) {
      return res.status(204).json({ success: false, message: "Eksik veri gönderildi." });
    }

    // 1) Order getir
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(204).json({ success: false, message: "Order bulunamadı." });
    }

    // 2) Eğer zaten kapatılmışsa uyar
    if (order.status == "tamamlandi") {
      return res.status(400).json({ success: false, message: "Bu sipariş zaten tamamlanmıs." });
    }

    await order.save();
    // 5) Masa’yı boşalt
    await Tables.findByIdAndUpdate(tableId, {
      status: "bos",
      currentOrderId: null,
    });

    return res.json({
      success: true,
      message: "Ödeme başarıyla alındı.",
      orderId: order._id,
    });
  } catch (err) {
    console.error("Ödeme alma hatası:", err);
    return res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};
//tableName, orderTotal, status, waiterName, orderDate
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("tableId", "name")
      .populate("waiterId", "firstName lastName")
      .sort({ createdAt: -1 });

    const result = orders.map(o => ({
      id: o._id,
      tableName: o.tableId?.name || null,
      orderTotal: o.total,
      status: o.status,
      waiterName: o.waiterId
        ? `${o.waiterId.firstName} ${o.waiterId.lastName}`
        : null,
      orderDate: o.createdAt
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Siparişler alınamadı" });
  }
};
// tableName, orderTotal, status, waiterName, orderDate, orderItems
exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("tableId", "name")
      .populate("waiterId", "firstName lastName")
      .populate({
        path: "orderItems",
        populate: {
          path: "foodId",
          select: "name imgs"
        }
      });

    if (!order) {
      return res.status(404).json({ success: false, message: "Sipariş bulunamadı" });
    }

    const result = {
      id: order._id,
      tableName: order.tableId?.name || null,
      orderTotal: order.total,
      status: order.status,
      waiterName: order.waiterId
        ? `${order.waiterId.firstName} ${order.waiterId.lastName}`
        : null,
      orderDate: order.createdAt,
      orderItems: order.orderItems.map(i => ({
        foodName: i.foodId?.name,
        qty: i.qty,
        unitPrice: i.unitprice,
        total: i.total,
        imgs: i.foodId?.imgs?.[0] || null
      }))
    };

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sipariş alınamadı" });
  }
};
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "tamamlandi" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Sipariş bulunamadı",
      });
    }

    return res.json({
      success: true,
      message: "Sipariş tamamlandı",
      
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};