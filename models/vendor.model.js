// models/vendor.model.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true, trim: true },
    organizer: { type: String, trim: true },
    category: { type: String, required: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
