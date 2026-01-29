const e = require("express");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    no_of_item: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    repair_item: { type: Number, default: 0, min: 0 },
    out_for_exhibition: { type: Number, default: 0, min: 0 },
    lost: { type: Number, default: 0, min: 0 },
    dead: { type: Number, default: 0, min: 0 },
    unit: {
      type: String,
      required: true,
      enum: ["pcs", "kg", "litre", "meter", "box", "packet", "dozen", "sqft.", "sqmtr.", "other", "set", "roll", "pair",],
    },
    total_no: { type: Number, min: 0 },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse'
    },
    remark: {
      type: String
    },
  },
  { timestamps: true }
);

//
// ✅ CREATE / SAVE
//
productSchema.pre("save", function () {
  this.total_no =
    this.no_of_item - this.repair_item - this.out_for_exhibition - this.lost - this.dead;
});

//
// ✅ UPDATE (FIXED)
//
productSchema.pre("findOneAndUpdate", async function () {

  const update = this.getUpdate();

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  // Get current values
  let no_of_item = doc.no_of_item;
  let repair_item = doc.repair_item;
  let lost = doc.lost;
  let dead = doc.dead;
  let out_for_exhibition = doc.out_for_exhibition;


  // ✅ Handle $set
  if (update.$set) {
    if (update.$set.no_of_item != null)
      no_of_item = update.$set.no_of_item;

    if (update.$set.repair_item != null)
      repair_item = update.$set.repair_item;

    if (update.$set.lost != null)
      lost = update.$set.lost;

    if (update.$set.dead != null)
      dead = update.$set.dead;

    if (update.$set.out_for_exhibition != null)
      out_for_exhibition = update.$set.out_for_exhibition;
  }


  // ✅ Handle $inc
  if (update.$inc) {

    if (update.$inc.out_for_exhibition != null)
      out_for_exhibition += update.$inc.out_for_exhibition;

    if (update.$inc.repair_item != null)
      repair_item += update.$inc.repair_item;

    if (update.$inc.lost != null)
      lost += update.$inc.lost;

    if (update.$inc.dead != null)
      dead += update.$inc.dead;
  }


  // ✅ Recalculate total
  const total_no =
    no_of_item - repair_item - out_for_exhibition - lost - dead;


  if (total_no < 0) {
    throw new Error(
      "Invalid stock update: stock cannot be negative"
    );
  }


  // ✅ Force set total_no
  this.setUpdate({
    ...update,
    $set: {
      ...(update.$set || {}),
      total_no,
    },
  });
});


module.exports = mongoose.model("Product", productSchema);
