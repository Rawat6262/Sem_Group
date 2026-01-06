const Warehouse = require("../models/warehouse.model");
// create warehouse  
exports.createWarehouse = async (req, res) => {
  const warehouse = new Warehouse({
    warehouseNo: req.body.warehouseNo,
    name: req.body.name,
    location: req.body.location,
    products: []
  });

  await warehouse.save();
  res.send(warehouse);
}

exports.getwarehouse = async (req,res)=>{
   const warehouse =  await Warehouse.find({
  });

  // await warehouse.save();
  res.send(warehouse); 
}


exports.getWarehouseProducts = async (req, res) => {
  try {
    const { warehouseId } = req.params;

    const warehouse = await Warehouse.findById(warehouseId)
      .populate("products"); // populate Product documents

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    const productCount = warehouse.products.length;

    return res.status(200).json({
      success: true,
      warehouseId: warehouse._id,
      warehouseName: warehouse.name,
      totalProducts: productCount,
      products: warehouse.products
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
