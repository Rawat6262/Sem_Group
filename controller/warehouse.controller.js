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