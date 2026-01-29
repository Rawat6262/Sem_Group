const mongoose = require("mongoose");
const Product = require("../models/product.model");
const IncomingDeliveryChallan = require("../models/incomingdocument.model");
const Exhibition = require("../models/exhibition.model");
const Warehouse = require("../models/warehouse.model");
const Transporter = require("../models/transporter.model");
// const ExhibitionStock = require("../models/pendingdocument.model");
const outgoingdocument = require("../models/outgoingdocument.model");
const ExhibitionStock = require("../models/pendingdocument.model");
const incomingdocumentModel = require("../models/incomingdocument.model");
// const Item = require("../models/Item");
exports.createoutgoingDeliveryChallan = async (req, res) => {

  const session = await mongoose.startSession();

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

    if (!exhibition_id || !from_warehouse || !transporter_id || !vehicle_no) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Start transaction
    await session.startTransaction();

    // ✅ Fetch one by one
    const exhibition = await Exhibition.findById(exhibition_id).session(session);
    if (!exhibition) throw new Error("Exhibition not found");

    const warehouse = await Warehouse.findById(from_warehouse).session(session);
    if (!warehouse) throw new Error("Warehouse not found");

    const transporter = await Transporter.findById(transporter_id).session(session);
    if (!transporter) throw new Error("Transporter not found");


    // ✅ Generate document number
    const totalOut = await outgoingdocument.countDocuments().session(session);
    const totalIn = await incomingdocumentModel.countDocuments().session(session);

    const document_number = `SEM/${totalOut + totalIn + 1}/25-26`;


    const finalItems = [];
    const pendingItems = [];

    let totalExhibitionQty = 0; // ⭐ NEW


    // ✅ Process items
    for (const i of items) {

      if (i.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      const product = await Product.findOneAndUpdate(
        {
          _id: i.item_id,
          total_no: { $gte: i.quantity },
          $expr: {
            $lte: [
              { $add: [ i.quantity] },
              "$total_no",
            ],
          },
        },
        {
          $inc: { out_for_exhibition: i.quantity },
        },
        { new: true, session }
      );
      if (!product) {
        throw new Error(`Not enough stock for item ${i.item_id}`);
      }

      totalExhibitionQty += i.quantity; // ⭐ NEW


      finalItems.push({
        item_id: product._id,
        item_name: product.name,
        quantity: i.quantity,
        received_quantity: 0,
        remark: "",
      });
      
      pendingItems.push({
        product_id: product._id,
        product_name: product.name,
        total_sent: i.quantity,
        pending_quantity: i.quantity,
      });
      
    }


    // ✅ Create challan
    const challan = await outgoingdocument.create(
      [
        {
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
        },
      ],
      { session }
    );


    // ✅ Update Exhibition main document ⭐ NEW
    await Exhibition.findByIdAndUpdate(
      exhibition_id,
      {
        $inc: { out_for_exhibition: totalExhibitionQty },
      },
      { session }
    );


    // ✅ Update ExhibitionStock
    let stock = await ExhibitionStock.findOne({
      exhibition_id,
      warehouse_id: from_warehouse,
    }).session(session);

    if (!stock) {
      stock = new ExhibitionStock({
        exhibition_id: exhibition._id,
        exhibition_name: exhibition.name,
        warehouse_id: warehouse._id,
        warehouse_name: warehouse.name,
        items: [],
      });
    }

    for (const newItem of pendingItems) {

      const existing = stock.items.find(
        (i) => i.product_id.toString() === newItem.product_id.toString()
      );

      if (existing) {
        existing.total_sent += newItem.total_sent;
        existing.pending_quantity += newItem.pending_quantity;
      } else {
        stock.items.push(newItem);
      }
    }

    await stock.save({ session });


    // ✅ Commit
    await session.commitTransaction();


    return res.status(201).json({
      success: true,
      message: "Outgoing Delivery Challan created successfully",
      data: challan[0],
    });

  } catch (error) {

    await session.abortTransaction();

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  } finally {

    await session.endSession();
  }
};


