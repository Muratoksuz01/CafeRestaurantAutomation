const Tables = require("../models/Table");
const Order = require("../models/Order");
const OrderItems = require("../models/OrderItem");
const User = require("../models/User")

// MASA LİSTELE
exports.getTables = async (req, res) => {
  try {
    // Tüm masaları çek
    const tables = await Tables.find();

    const result = [];

    for (const table of tables) {
      let orderCreated = null;
      // let locationName=await Location.findById(table.locationId).select("name").name || "bilinmiyor"
      let orderTotal = null;
      let waiterName = null
      // Masa doluysa aktif sipariş bilgisini al
      if (table.status === "dolu" && table.currentOrderId) {
        const order = await Order.findById(table.currentOrderId);

        if (order) {
          // Sipariş oluşma saati (HH:MM formatında)
          const createdAt = new Date(order.createdAt);
          const hours = createdAt.getHours().toString().padStart(2, "0");
          const minutes = createdAt.getMinutes().toString().padStart(2, "0");

          orderCreated = `${hours}:${minutes}`;
          orderTotal = order.total;
          const waiter = await User.findById(order.waiterId).select("firstName");
          waiterName = waiter?.firstName ?? "bilinmiyor";
        }
      }

      result.push({
        _id: table._id,
        name: table.name,
        status: table.status,                // bos / dolu
        currentOrderId: table.currentOrderId || null,
        locationId: table.locationId,
        waiterName,
        orderCreated,                        // "19:03"
        orderTotal                           // Örn: 200
      });
    }

    return res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// TEK MASA DETAY + ORDER + ORDER ITEMS
exports.getTable = async (req, res) => {
  try {
    // console.log(req.query.id);

    const table = await Tables.findById(req.query.id);

    if (!table) {
      return res.status(204).json({ success: false, message: "Masa bulunamadı" });
    }
  

    // Masa boşsa direkt dön
    if (!table.currentOrderId) {
      return res.json({
        success: true,
        data: {
          _id: table._id,
          name: table.name,
          status: table.status,
          adisyon: null
        }
      });
    }

    // Order
    const order = await Order.findById(table.currentOrderId);

    if (!order) {
      return res.json({
        success: true,
        data: {
          _id: table._id,
          name: table.name,
          status: table.status,
          adisyon: null
        }
      });
    }

    // OrderItems
    const orderItems = await OrderItems.find({ _id: { $in: order.orderItems } }).populate('foodId', 'name price');

    const items = orderItems.map((item) => ({
      foodId: item.foodId,
      qty: item.qty,
      price: item.foodId.price,
      name:item.foodId.name
    }));

    return res.json({
      success: true,
      data: {
        _id: table._id,
        name: table.name,
        status: table.status,
        adisyon: {
          id: order._id,
          total: order.total,
          items
        }
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// MASA OLUŞTUR
exports.createTable = async (req, res) => {
  try {
    const { name, } = req.body;

    const newTable = new Tables({
      name,
      status: "bos",
      currentOrderId: null,
    });

    await newTable.save();
    res.json({ success: true, data: newTable });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// MASA GÜNCELLE
exports.editTable = async (req, res) => {
  try {
    const { name } = req.body;

    const updated = await Tables.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Masa bulunamadı" });
    }

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// MASA SİL
exports.deleteTable = async (req, res) => {
  try {
    const removed = await Tables.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ success: false, message: "Masa bulunamadı" });
    }

    res.json({ success: true, message: "Masa silindi" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.reassignTables = async (req, res) => {
  try {
    const { oldTableId, newTableId, orderId } = req.body;

    if (!oldTableId || !newTableId || !orderId) {
      return res.status(204).json({ success: false, message: "Eksik parametre" });
    }

    const oldTable = await Tables.findById(oldTableId);
    const newTable = await Tables.findById(newTableId);

    if (!oldTable || !newTable) {
      return res.status(204).json({ success: false, message: "Masalardan biri bulunamadı" });
    }

    // Order'ın masaId'sini güncelle
    await Order.findByIdAndUpdate(orderId, {
      tableId: newTableId
    });

    // Eski masa boşalt
    await Tables.findByIdAndUpdate(oldTableId, {
      status: "bos",
      currentOrderId: null
    });

    // Yeni masayı doldur
    await Tables.findByIdAndUpdate(newTableId, {
      status: "dolu",
      currentOrderId: orderId
    });

    return res.json({ success: true, message: "Masa başarılı şekilde değiştirildi" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};


/* exports.book = async (req, res) => {
  try {
    const { id } = req.params; // masa id

    const table = await Table.findById(id);
    if (!table) {
      return res.status(200).json({
        success: false,
        message: "Masa bulunamadı"
      });
    }

    const newStatus = table.status === "rezerve" ? "bos" : "rezerve";

    await Table.findByIdAndUpdate(id, {
      status: newStatus
    });

    return res.status(200).json({
      success: true,
      message:
        newStatus === "rezerve"
          ? "Masa rezerve edildi"
          : "Rezervasyon iptal edildi"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Bir hata oluştu"
    });
  }
}; */




