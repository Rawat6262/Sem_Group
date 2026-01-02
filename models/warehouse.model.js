const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  warehouseNo: String,
  name: String,
  location: String,

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      unique:true
    }
  ]
});

let Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports =Warehouse
