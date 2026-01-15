const mongoose = require("mongoose");
const Item = require("../models/item.model");
const Product = require("../models/product.model");

exports.createItem = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { item_name, quantity, remark, item_id } = req.body;



    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    // 1️⃣ Get Product
    const product = await Product.findById(item_id).session(session);
    if (!product) {
      throw new Error("Product not found");
    }
    console.log(product.total_no);
    if(quantity > product.total_no){
    // 2️⃣ Validation: quantity + out_for_exhibition ≤ no_of_item
    if (product.out_for_exhibition + quantity > product.total_no) {
      throw new Error(
        `Not enough stock. Available: ${
          product.total_no
        }`
      );
    }}

    // 3️⃣ Create Item
    const item = await Item.create(
      [
        {
          item_name,
          quantity,
          remark,
          item_id,
        },
      ],
      { session }
    );

    // 4️⃣ Update Product stock
    product.out_for_exhibition += quantity;
    await product.save({ session });

    // 5️⃣ Commit
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Item added and stock updated successfully",
      data: item[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
