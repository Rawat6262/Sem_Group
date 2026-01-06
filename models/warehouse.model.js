const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  warehouseNo: {
    type:Number,
    unique:true
  },
  name: String,
  location: String,

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ]
});

let Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports =Warehouse
