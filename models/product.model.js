const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  total_no: Number,
  sku: String
});

module.exports = mongoose.model("Product", productSchema);
