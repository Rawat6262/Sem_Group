const mongoose = require("mongoose");

const exhibitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    venue: { type: String, required: true },
    organiser: { type: String, required: true },
    email: { type: String },
    phone: { type: String },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String },

    remarks: { type: String },

    // ✅ Correct ref name
    client: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exhibition", exhibitionSchema);
