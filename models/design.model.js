const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    taken_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Client'          // person name OR change to ObjectId if needed
         },

    option_no: {
      type: Number,
      required: true,
      min: 1,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },isfinal:{
      type:Boolean,
      required:true,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Design", designSchema);
