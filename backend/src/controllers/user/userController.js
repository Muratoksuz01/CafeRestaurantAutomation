const Tables = require("../../models/Table");
const Order = require("../../models/Order");
const OrderItems = require("../../models/OrderItem");
const User = require("../../models/User")
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
        locationId:table.locationId,
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
// TEK MASA GETİR
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
    const orderItems = await OrderItems.find({ _id: { $in: order.orderItems } });

    const items = orderItems.map((item) => ({
      foodId: item.foodId,
      name: item.name,
      qty: item.qty,
      price: item.price
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
    const { name, locationId} = req.body;

    const newTable = new Tables({
      name,
      status: "bos",
      currentOrderId: null,
      locationId
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
    const { name} = req.body;

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
exports.book = async (req, res) => {
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
};
exports.createOrder = async (req, res) => {
  try {
    const { tableId, basket, total,  } = req.body;
    const userId=req.user.id
    // 1) Yeni Order oluştur
    const newOrder = new Order({
      tableId,
      total,
      isClosed: false,
      orderItems: [],
      waiterId: userId
    });

    const savedOrder = await newOrder.save();

    // 2) Basket -> OrderItems kaydet
    const itemsToSave = basket.map((b) => ({
      name: b.name,
      foodId: b._id,
      orderId: savedOrder._id,
      qty: b.qty,
      price: b.price
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
        name: item.name,
        foodId: item._id,          // frontend item._id = foodId
        orderId,
        qty: item.qty,
        price: item.price,
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
    if (order.isClosed) {
      return res.status(204).json({ success: false, message: "Bu sipariş zaten kapatılmış." });
    }

    // 3) Basketten gerçek OrderItems oluştur
    /*     const createdItems = await Promise.all(
          basket.map(async (b) => {
            const newItem = await OrderItems.create({
              name: b.name,
              foodId: b._id,
              orderId: order._id,
              qty: b.qty,
              price: b.price,
            });
            return newItem._id;
          })
        ); */

    // 4) Order’ı güncelle → kapat
    //  order.total = total;
    order.isClosed = true;
    // order.orderItems = createdItems;
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

