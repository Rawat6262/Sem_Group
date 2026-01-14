const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  warehouseNo: {
    type:Number,
    unique:true
  },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
  name: String,
  address:{
      type: String,
      required: true,
      unique: true,
    
    },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ]
});

let Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports =Warehouse;
