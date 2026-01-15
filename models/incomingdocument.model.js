const mongoose = require("mongoose");



const incomingDeliveryChallanSchema = new mongoose.Schema(
  {
    document_name: {
      type: String,
      default: "Incoming Delivery Challan",
      trim: true,
    },

    document_number: {
      type: Number,
      required: true,
      unique: true,   // always unique
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
    exhibition_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibition", // exhibition collection
      required: true,
    },
    exhibition_date: {
      type: Date,
      required: true,
    },

    exhibition_name: {
      type: String,
      required: true,
      trim: true,
    },

    gst_number: {
      type: String,
      default: "03CAQPK9502D1ZU",
      trim: true,
    },

    exhibition_venue: {
      type: String,
      required: true,
      trim: true,
    },

    from_warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Warehouse", // warehouse collection
    },
    from_warehouse_name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:'itemSchema'
      }, // array of objects 
    ],

    transporter_name: {
      type: String,
      required: true,
      trim: true,
    },

    transporter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transporter", // transporter collection
      required: true,
    },

    vehicle_no: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncomingDeliveryChallan", incomingDeliveryChallanSchema);
