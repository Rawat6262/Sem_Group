const mongoose = require("mongoose");

const transporterSchema = new mongoose.Schema(
  {
    transporter_name: {
      type: String,
      required: true,
      trim: true,
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
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    payment: {
      type: String,
      enum: ["cash", "online", "upi", "bank"],
      default: "cash",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transporter", transporterSchema);
