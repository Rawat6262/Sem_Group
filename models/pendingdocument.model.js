const mongoose = require("mongoose");

const exhibitionStockItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },

    total_sent: {
      type: Number,
      required: true,
      min: 0,
    },

    // total_received: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    // },

    pending_quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const exhibitionStockSchema = new mongoose.Schema(
  {
    exhibition_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibition",
      required: true,
    },
    exhibition_name: {
      type: String,
      required: true,
    },

    warehouse_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    warehouse_name: {
      type: String,
      required: true,
    },

    items: {
      type: [exhibitionStockItemSchema],
      required: true,
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate stock doc for same exhibition + warehouse
exhibitionStockSchema.index(
  { exhibition_id: 1, warehouse_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("ExhibitionStock", exhibitionStockSchema);
