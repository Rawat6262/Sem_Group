const mongoose = require("mongoose");
const Item = require("../models/item.model");
const Product = require("../models/product.model");

// exports.createItem = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { item_name, quantity, remark, item_id } = req.body;
//     if (quantity <= 0) {
//       throw new Error("Quantity must be greater than 0");
//     }

//     // 1️⃣ Get Product
//     const product = await Product.findById(item_id).session(session);
//     if (!product) {
//       throw new Error("Product not found");
//     }
//     console.log(product.total_no);
//     if(quantity > product.total_no){
//     // 2️⃣ Validation: quantity + out_for_exhibition ≤ no_of_item
//     if (product.out_for_exhibition + quantity > product.total_no) {
//       throw new Error(
//         `Not enough stock. Available: ${
//           product.total_no
//         }`
//       );
//     }}

//     // 3️⃣ Create Item
//     const item = await Item.create(
//       [
//         {
//           item_name,
//           quantity,
//           remark,
//           item_id,
//         },
//       ],
//       { session }
//     );

//     // 4️⃣ Update Product stock
//     product.out_for_exhibition += quantity;
//     await product.save({ session });

//     // 5️⃣ Commit
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       success: true,
//       message: "Item added and stock updated successfully",
//       data: item[0],
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
     

const IncomingDeliveryChallan = require("../models/incomingdocument.model");
const Exhibition = require("../models/exhibition.model");
const Warehouse = require("../models/warehouse.model");
const Transporter = require("../models/transporter.model");
const ExhibitionStock = require("../models/pendingdocument.model");
// const Item = require("../models/Item");

exports.createIncomingDeliveryChallan = async (req, res) => {
  try {
    const {
      exhibition_id,
      from_warehouse,
      transporter_id,
      vehicle_no,
      items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required",
      });
    }
    if(!exhibition_id || !from_warehouse || !transporter_id || !vehicle_no){
      return res.status(400).json({
        success: false,
        message: "exhibition_id, from_warehouse, transporter_id and vehicle_no are required",
      });
    }
    // 🔢 AUTO DOCUMENT NUMBER
    const count = await IncomingDeliveryChallan.countDocuments();
    const document_number = `SEM/${count + 1}/25-26`;

    // 🏛️ FETCH EXHIBITION
    const exhibition = await Exhibition.findById(exhibition_id);
    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    // 🏬 FETCH WAREHOUSE
    const warehouse = await Warehouse.findById(from_warehouse);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    // 🚚 FETCH TRANSPORTER
    const transporter = await Transporter.findById(transporter_id);
    if (!transporter) {
      return res.status(404).json({
        success: false,
        message: "Transporter not found",
      });
    }

    // 📦 BUILD ITEMS ARRAY (AUTO-FILL REQUIRED FIELDS)
    const finalItems = [];
    const pendingItems = [];

    for (const i of items) {
      const item = await Product.findById(i.item_id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item not found: ${i.item_id}`,
        });
      }
       const session = await mongoose.startSession();
  session.startTransaction();
//  
//     const { item_name, quantity, remark, item_id } = req.body;
    if (i.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

//     // 1️⃣ Get Product
    const product = await Product.findById(i.item_id).session(session);
    if (!product) {
      throw new Error("Product not found");
    }
    console.log(product.total_no);
     if(i.quantity > product.total_no){
    // 2️⃣ Validation: quantity + out_for_exhibition ≤ no_of_item
    if (product.out_for_exhibition + i.quantity > product.total_no) {
      throw new Error(
        `Not enough stock of ${product.name}. Available: ${
          product.total_no
        }`
      );
    }}
    
    
     product.out_for_exhibition += i.quantity;
    await product.save({ session });

    // 5️⃣ Commit
    await session.commitTransaction();
    session.endSession();

// console.log("data",data);
      finalItems.push({
        item_id: item._id,
        item_name: item.name,   // ✅ REQUIRED
        quantity: i.quantity,
        received_quantity: 0,
        remark: "",
      });
      pendingItems.push({
        product_id: item._id,
        product_name: item.name,
        total_sent: i.quantity,
        // total_received: 0,
        pending_quantity: i.quantity,
      });
    }
    // 🧾 CREATE CHALLAN
    const challan = await IncomingDeliveryChallan.create({
      document_number,
      exhibition_id: exhibition._id,
      exhibition_name: exhibition.name,
      exhibition_date: exhibition.startDate,
      exhibition_venue: exhibition.venue,

      from_warehouse: warehouse._id,
      from_warehouse_name: warehouse.name,

      transporter_id: transporter._id,
      transporter_name: transporter.transporter_name,

      vehicle_no,
      items: finalItems,
    });

    res.status(201).json({
      success: true,
      message: "Incoming Delivery Challan created successfully",
      data: challan,
    });
let data = await ExhibitionStock.findOne({
  warehouse_id: from_warehouse,
  exhibition_id: exhibition_id,
});

if (data) {
  for (const newItem of pendingItems) {

    // 1️⃣ Try updating existing product
    const updated = await ExhibitionStock.findOneAndUpdate(
      {
        exhibition_id: exhibition_id,
        warehouse_id: from_warehouse,
        "items.product_id": newItem.product_id,
      },
      {
        $inc: {
          "items.$.total_sent": newItem.total_sent,
          "items.$.pending_quantity": newItem.pending_quantity,
        },
      },
      { new: true }
    );

    // 2️⃣ If product not found → push new item
    if (!updated) {
      await ExhibitionStock.findOneAndUpdate(
        {
          exhibition_id: exhibition_id,
          warehouse_id: from_warehouse,
        },
        {
          $push: {
            items: newItem,
          },
        },
        { new: true }
      );
    }
  }
}

// 3️⃣ If stock document does NOT exist → create
if (!data) {
  data = await ExhibitionStock.create({
    exhibition_id: exhibition._id,
    exhibition_name: exhibition.name,
    warehouse_id: warehouse._id,
    warehouse_name: warehouse.name,
    items: pendingItems,
  });
}

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

