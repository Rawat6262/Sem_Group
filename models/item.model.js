const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
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
    remark: {
      type: String,
      trim: true,
      default: "",
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // reference to Product collection
      required: true,
    }, 
  },
);
module.exports = mongoose.model("Item", itemSchema);