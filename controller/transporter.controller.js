const Transporter = require("../models/transporter.model");

// ✅ Create Transporter
exports.createTransporter = async (req, res) => {
  try {
    const transporter = await Transporter.create(req.body);
    res.status(201).json({
      success: true,
      message: "Transporter created successfully",
      data: transporter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get All Transporters
exports.getAllTransporters = async (req, res) => {
  try {
    const transporters = await Transporter.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: transporters.length,
      data: transporters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Transporter By ID
exports.getTransporterById = async (req, res) => {
  try {
    const transporter = await Transporter.findById(req.params.id);

    if (!transporter) {
      return res.status(404).json({
        success: false,
        message: "Transporter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: transporter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid transporter ID",
    });
  }
};

// ✅ Update Transporter
exports.updateTransporter = async (req, res) => {
  try {
    const transporter = await Transporter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!transporter) {
      return res.status(404).json({
        success: false,
        message: "Transporter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transporter updated successfully",
      data: transporter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete Transporter
exports.deleteTransporter = async (req, res) => {
  try {
    const transporter = await Transporter.findByIdAndDelete(req.params.id);

    if (!transporter) {
      return res.status(404).json({
        success: false,
        message: "Transporter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transporter deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid transporter ID",
    });
  }
};
