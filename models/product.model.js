const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    no_of_item: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    repair_item: { type: Number, default: 0, min: 0 },
    out_for_exhibition: { type: Number, default: 0, min: 0 },
    remark: { type: String },
    total_no: { type: Number, min: 0 },
  },
  { timestamps: true }
);

//
// ✅ CREATE / SAVE
//
productSchema.pre("save", function () {
  this.total_no =
    this.no_of_item - this.repair_item - this.out_for_exhibition;
});

//
// ✅ UPDATE (FIXED)
//
productSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  const $set = update.$set || update;

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const no_of_item = $set.no_of_item ?? doc.no_of_item;
  const repair_item = $set.repair_item ?? doc.repair_item;
  const out_for_exhibition =
    $set.out_for_exhibition ?? doc.out_for_exhibition;

  $set.total_no =
    no_of_item - repair_item - out_for_exhibition;

  this.setUpdate({ $set });
});

module.exports = mongoose.model("Product", productSchema);
