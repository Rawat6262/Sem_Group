const SignupSem = require("../models/signup.Model");

/**
 * CREATE SIGNUP
 */
exports.createSignup = async (req, res) => {
  try {
    const user = await SignupSem.create(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ALL USERS
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await SignupSem.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET USER BY ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await SignupSem.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await SignupSem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    await SignupSem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// create warehouse   