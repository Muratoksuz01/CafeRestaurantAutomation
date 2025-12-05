const Tables = require("../../models/Table");
const Order = require("../../models/Order");
const OrderItems = require("../../models/OrderItem")
// MASA LİSTELE
exports.getTables = async (req, res) => {
  try {
    const tables = await Tables.find();
    const result = await Promise.all(
      tables.map(async (table) => {
        // Masa boşsa
        if (!table.currentOrderId) {
          return {
            _id: table._id,
            name: table.name,
            status: "bos",
            adisyon: null
          };
        }

        // Masa dolu → adisyonu getir
        const order = await Order.findById(table.currentOrderId);

        if (!order) {
          return {
            _id: table._id,
            name: table.name,
            status: "bos",
            adisyon: null
          };
        }

        // Order içindeki ürünleri düzenle
        const items = await Promise.all(
          order.orderItems.map(async (itemId) => {
            const item = await OrderItems.findById(itemId);
            return {
              foodId: item.foodId,
              name: item.name,
              qty: item.qty,
              price: item.price,
            };
          })
        );

        const total = order.total;

        // Masa dolu + adisyon var
        return {
          _id: table._id,
          name: table.name,
          status: "dolu",
          adisyon: {
            id: order._id,
            items,
            total
          }
        };
      })
    );

    return res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// TEK MASA GETİR
exports.getTable = async (req, res) => {
  try {
    const table = await Tables.findById(req.params.id).populate("currentOrderId");
    if (!table) {
      return res.status(404).json({ success: false, message: "Masa bulunamadı" });
    }
    res.json({ success: true, data: table });
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
      currentOrderId: null
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
    const { name, } = req.body;

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


exports.createOrder = async (req, res) => {
  try {
    const { tableId, basket, total } = req.body;

    // 1) Yeni Order oluştur
    const newOrder = new Order({
      tableId,
      total,
      isClosed: false,
      orderItems: []
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

