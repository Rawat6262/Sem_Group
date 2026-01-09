const Exhibition = require("../models/exhibition.model");

// ✅ CREATE Exhibition
exports.createExhibition = async (req, res) => {
  try {
    const exhibition = new Exhibition(req.body);
    await exhibition.save();

    res.status(201).json({
      success: true,
      message: "Exhibition created successfully",
      data: exhibition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET All Exhibitions
exports.getAllExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: exhibitions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET Exhibition by ID
exports.getExhibitionById = async (req, res) => {
  try {
    const exhibition = await Exhibition
      .findById(req.params.id)
      .populate("client"); // works now ✅

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exhibition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ UPDATE Exhibition
exports.updateExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exhibition updated successfully",
      data: exhibition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE Exhibition
exports.deleteExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.findByIdAndDelete(req.params.id);

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exhibition deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addclient =  async (req, res) => {
  let exhibitionid =req.params.id;
//   console.log(warehouseId)
  const warehouse = await Exhibition.findById(req.params.id);

  warehouse.client.push(req.body.clientid);

  await Exhibition.findByIdAndUpdate(
  exhibitionid,
  { $addToSet: { client:req.body.clientid } }, // 👈 prevents duplicates
  { new: true }
);

  res.send(warehouse);
}
