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
  await Product.findByIdAndUpdate(
  req.body.productId,
  { $addToSet: { warehouse: req.params.id } }, // 👈 prevents duplicates
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
      vendor,
      warehouseid,unit
    } = req.body;

    // ✅ Validation
    if (!name || no_of_item == null || !category || !unit) {
      return res.status(400).json({
        success: false,
        message: "name, no_of_item, category and unit are required",
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
      unit,
      out_for_exhibition,
      vendor,
      warehouse: warehouseid
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
    const products = await Product.find().populate('vendor')

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

// exports.updateproduct = async (req, res) => {
//   try{


//   }
// }
exports.updateproduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;  
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    }
    );  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }}
exports.outgoingexhibitionproduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { out_for_exhibition, remark } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { out_for_exhibition: out_for_exhibition }, // 🔥 AUTO detect increment
        $set: { remark },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product moved to exhibition",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
