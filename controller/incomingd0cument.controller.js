const mongoose = require("mongoose");
const Product = require("../models/product.model");
const IncomingDeliveryChallan = require("../models/incomingdocument.model");
const Exhibition = require("../models/exhibition.model");
const Warehouse = require("../models/warehouse.model");
const Transporter = require("../models/transporter.model");
// const ExhibitionStock = require("../models/pendingdocument.model");
const outgoingdocument = require("../models/outgoingdocument.model");
const pendingdocumentModel = require("../models/pendingdocument.model");
const incomingdocumentModel = require("../models/incomingdocument.model");
// const Item = require("../models/Item");

exports.createincomingDeliveryChallan = async (req, res) => {
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
    const pending = await pendingdocumentModel.findOne({
  exhibition_id,
  warehouse_id: from_warehouse,
  items: {
    $all: items.map(i => ({
      $elemMatch: {
        product_id: i.item_id,
        pending_quantity: { $gte: i.quantity }
      }
    }))
  }
});

if (!pending) {
  return res.status(400).json({
    success: false,
    message: "Pending document does not match requested items",
  });
}

    session.startTransaction();

    // Fetch data inside transaction
    const [exhibition, warehouse, transporter] = await Promise.all([
      Exhibition.findById(exhibition_id).session(session),
      Warehouse.findById(from_warehouse).session(session),
      Transporter.findById(transporter_id).session(session),
    ]);

    if (!exhibition) throw new Error("Exhibition not found");
    if (!warehouse) throw new Error("Warehouse not found");
    if (!transporter) throw new Error("Transporter not found");

    // Generate doc number (still not perfect, but safer)
    const totalDocs = await IncomingDeliveryChallan.countDocuments().session(session);
    const totalOut = await outgoingdocument.countDocuments().session(session);

    const document_number = `SEM/${totalDocs + totalOut + 1}/25-26`;

    const finalItems = [];

    // Process items
    for (const i of items) {

      const product = await Product.findById(i.item_id).session(session);

      if (!product) {
        throw new Error(`Item not found: ${i.item_id}`);
      }

      if (i.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      // Atomic stock check + update
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: i.item_id,
          out_for_exhibition: { $gte: i.quantity }
        },
        {
          $inc: { out_for_exhibition: -i.quantity }
        },
        { new: true, session }
      );

      if (!updatedProduct) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      // Update pending
      const updatedPending = await pendingdocumentModel.findOneAndUpdate(
        {
          exhibition_id,
          warehouse_id: from_warehouse,
          "items.product_id": i.item_id,
          "items.pending_quantity": { $gte: i.quantity }
        },
        {
          $inc: {
            "items.$.pending_quantity": -i.quantity
          }
        },
        { new: true, session }
      );

      if (!updatedPending) {
        throw new Error(`Not enough pending for ${product.name}`);
      }

      finalItems.push({
        item_id: product._id,
        item_name: product.name,
        quantity: i.quantity,
        received_quantity: 0,
        remark: "",
      });
    }

    // Create challan inside transaction
    const challan = await incomingdocumentModel.create(
      [{
        document_number,

        exhibition_id: exhibition._id,
        exhibition_name: exhibition.name,
        exhibition_date: exhibition.startDate,
        exhibition_venue: exhibition.venue,

        from_warehouse: warehouse._id,
        from_warehouse_name: warehouse.name,
        return_address: warehouse.address,

        transporter_id: transporter._id,
        transporter_name: transporter.transporter_name,

        vehicle_no,
        items: finalItems,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Incoming challan created successfully",
      data: challan[0],
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

  
