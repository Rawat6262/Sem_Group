const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // Exhibition Reference
    exhibition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibition",
      required: true,
    },

    // Category
    category: {
      type: String,
      enum: ["labour", "transport", "exhibition", "other"],
      required: true,
    },

    // References
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labour",
      default: null,
    },

    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transporter",
      default: null,
    },

    // Total Bill / Expense
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // How Much Paid
    paid_amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Payment Mode (Last Payment)
    payment_mode: {
      type: String,
      enum: ["cash", "upi", "bank", "online"],
      default: "cash",
    },

    // Payment Status
    status: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },

    // Notes
    remark: String,

    transaction_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

