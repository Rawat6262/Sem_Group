// controllers/designController.js
const Design = require("../models/design.model");

/* ================= CREATE DESIGN ================= */
exports.createDesign = async (req, res) => {
  try {
    const { taken_by } = req.params;   // 👈 from params
    const { option_no, remarks } = req.body;

    const design = await Design.create({
      taken_by,
      option_no,
      remarks,
    });

    res.status(201).json({
      success: true,
      message: "Design created successfully",
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL DESIGNS ================= */
exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.find().populate("taken_by");

    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET DESIGN BY ID ================= */
exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate("taken_by");

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.status(200).json({
      success: true,
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET DESIGNS BY CLIENT ================= */
exports.getDesignsByClient = async (req, res) => {
  try {
    const { taken_by } = req.params;

    const designs = await Design.find({ taken_by })
      .populate("taken_by");

    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE DESIGN ================= */
exports.updateDesign = async (req, res) => {
  try {
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Design updated successfully",
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE DESIGN ================= */
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controllers/designController.js

/* ========== MAKE DESIGN FINAL ========== */
exports.makeDesignFinal = async (req, res) => {
  try {
    const { id } = req.params;

    const design = await Design.findById(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    if (design.isfinal === true) {
      return res.status(400).json({
        success: false,
        message: "Design is already marked as final",
      });
    }

    design.isfinal = true;
    await design.save();

    res.status(200).json({
      success: true,
      message: "Design marked as final successfully",
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
