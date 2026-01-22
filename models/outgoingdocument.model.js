const mongoose = require("mongoose");

const outgoingItemSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    item_name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    received_quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    remark: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const outgoingdocument = new mongoose.Schema(
  {
    document_name: {
      type: String,
      default: "Sem_group",
      enum: ["Sem_group", "furnishkar"],
    },
    document_number: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exhibition_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibition",
      required: true,
    },
    exhibition_date: {
      type: Date,
      required: true,
    },
    exhibition_name: {
      type: String,
      required: true,
    },
    gst_number: {
      type: String,
      default: "03CAQPK9502D1ZU",
    },
    exhibition_venue: {
      type: String,
      required: true,
    },
    from_warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    from_warehouse_name: {
      type: String,
      required: true,
    },

    // ✅ MULTIPLE ITEMS HERE
    items: {
      type: [outgoingItemSchema],
      required: true,
    },

    transporter_name: {
      type: String,
      required: true,
    },
    transporter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transporter",
      required: true,
    },
    vehicle_no: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "outgoingdocument",
  outgoingdocument
);
