const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String },
    email: { type: String,  },
    phone: { type: String, required: true },

    country: { type: String, required: true },
    countryCode: { type: String, },

    state: { type: String, required: true },
    stateCode: { type: String,  },

    city: { type: String, required: true },
    zipCode: { type: String },

    address: { type: String },
    remarks: { type: String },

    isActive: { type: Boolean, default: true },
    design:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Design"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
