const Warehouse = require("../models/warehouse.model");

exports.addProduct =  async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id);

  warehouse.products.push(req.body.productId);

  await warehouse.save();
  res.send(warehouse);
}
