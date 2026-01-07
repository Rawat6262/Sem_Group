const Product = require("../models/product.model");
const Warehouse = require("../models/warehouse.model");

exports.addProductInwarehouse =  async (req, res) => {
  let warehouseId =req.params.id;
  console.log(warehouseId)
  const warehouse = await Warehouse.findById(req.params.id);

  warehouse.products.push(req.body.productId);

  await Warehouse.findByIdAndUpdate(
  warehouseId,
  { $addToSet: { products:req.body.productId } }, // 👈 prevents duplicates
  { new: true }
);

  res.send(warehouse);
}


exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      no_of_item,
      category,
      repair_item = 0,
      out_for_exhibition = 0,
    } = req.body;

    // ✅ Validation
    if (!name || no_of_item == null || !category) {
      return res.status(400).json({
        success: false,
        message: "name, no_of_item and category are required",
      });
    }

    if (repair_item + out_for_exhibition > no_of_item) {
      return res.status(400).json({
        success: false,
        message: "repair_item + out_for_exhibition cannot exceed no_of_item",
      });
    }

    // ✅ AUTO CALCULATION
    const total_no = no_of_item - repair_item - out_for_exhibition;

    // ✅ SAVE STYLE
    const product = new Product({
      name,
      no_of_item,
      category,
      repair_item,
      out_for_exhibition,
      total_no,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



/**
 * @route   GET /api/products
 * @desc    Get all products
 */
exports.getproduct = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

