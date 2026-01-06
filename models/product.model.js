const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    no_of_item: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true
    },
    repair_item: {
      type: Number,
      default: 0,
      min: 0
    },
    out_for_exhibition: {
      type: Number,
      default: 0,
      min: 0
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Virtual field
productSchema.virtual("total_no").get(function () {
  return this.no_of_item - this.repair_item - this.out_for_exhibition;
});

module.exports = mongoose.model("Product", productSchema);
