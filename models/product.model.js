  const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    no_of_item: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    repair_item: {
      type: Number,
      default: 0,
    },
    out_for_exhibition: {
      type: Number,
      default: 0,
    },
    total_no: {
      type: Number,
      default: function () {
        return this.no_of_item - this.repair_item - this.out_for_exhibition;
      },
    },
  });

  let Product=mongoose.model("Product", productSchema);
  module.exports =Product
