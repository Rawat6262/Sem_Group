const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    exhibition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibition",
      required: true,
    },

    category: {
      type: String,
      enum: ["labour", "transport", "exhibition", "other"],
      required: true,
    },

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

    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paid_amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ✅ Stored in DB
    pending_amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    payment_mode: {
      type: String,
      enum: ["cash", "upi", "bank", "online"],
      default: "cash",
    },

    status: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },

    remark: String,

    transaction_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//
// ✅ On save (create / save)
//
transactionSchema.pre("save", function () {
  if (this.paid_amount > this.total_amount) {
    this.paid_amount = this.total_amount;
  }

  const pending =
    this.total_amount - this.paid_amount;

  this.pending_amount = pending;

  if (pending <= 0) {
    this.status = "paid";
    this.pending_amount = 0;
  } else if (this.paid_amount > 0) {
    this.status = "partial";
  } else {
    this.status = "pending";
  }
});

//
// ✅ On findOneAndUpdate (findByIdAndUpdate)
//
transactionSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  let total = update.total_amount;
  let paid = update.paid_amount;

  if (update.$set) {
    total = update.$set.total_amount ?? total;
    paid = update.$set.paid_amount ?? paid;
  }

  if (total !== undefined || paid !== undefined) {
    // Get current doc values
    return this.model
      .findOne(this.getQuery())
      .then((doc) => {
        if (!doc) return;

        const newTotal =
          total ?? doc.total_amount;

        const newPaid =
          paid ?? doc.paid_amount;

        let pending = newTotal - newPaid;

        if (pending < 0) pending = 0;

        this.setUpdate({
          ...update,
          pending_amount: pending,
          status:
            pending === 0
              ? "paid"
              : newPaid > 0
              ? "partial"
              : "pending",
        });
      });
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
