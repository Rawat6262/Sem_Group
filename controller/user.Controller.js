const SignupSem = require("../models/signup.Model");
let nodemailer= require('nodemailer');
const { setExhibition } = require("../utils/service");
/**
 * CREATE SIGNUP
 */
const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");

exports.createSignup = async (req, res) => {
  try {
    const {
      full_name,
      gmail,
      mobile_number,
      city,
      state,
      country,
      address,
      gender,
      role,
      password
    } = req.body;

    // 1️⃣ Check already approved user
    const approvedUser = await SignupSem.findOne({
      gmail,
      isapproved: true
    });

    if (approvedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists and is approved"
      });
    }

    // 2️⃣ Check pending user
    const pendingUser = await SignupSem.findOne({
      gmail,
      isapproved: false
    });

    if (pendingUser) {
      return res.status(409).json({
        success: false,
        message: "OTP already sent. Please verify"
      });
    }

    // 3️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"Onexhib App" <no-reply@onexhib.com>',
      to: gmail,
      subject: "Your OTP Code - Onexhib Verification",
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p>`
    });

    // 6️⃣ Save user
    const user = await SignupSem.create({
      full_name,
      gmail,
      mobile_number,
      city,
      state,
      country,
      address,
      gender,
      role,
      password: hashedPassword,
      otp,
      otpExpiry,
      isapproved: false
    });

    const token = setExhibition(user);

    res
      .cookie("uid", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      })
      .status(201)
      .json({
        success: true,
        message: "OTP sent successfully",
        userId: user._id
      });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



exports.handleapplogin = async function (req, res) {
  try {
    const { gmail, password } = req.body;

    // 1️⃣ Find user by email
    const user = await SignupSem.findOne({ gmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered"
      });
    }

    // 2️⃣ Check approval
    if (!user.isapproved) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please verify OTP."
      });
    }

    // 3️⃣ Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 4️⃣ Generate token
    const token = setExhibition(user);

    // 5️⃣ Remove sensitive fields
    const userResponse = {
      _id: user._id,
      full_name: user.full_name,
      gmail: user.gmail,
      role: user.role
    };

    res
      .cookie("uid", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: userResponse
      });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};


// verify user
exports.handleappotp= async (req, res)=> {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find the OTP entry
    const record = await SignupSem.findOne({ otp });

    if (!record) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    // Update approval status
    const updateResult = await SignupSem.updateOne(
      { gmail: record.gmail, otp: otp },
      { $set: { isapproved: true } }
    );
    const finalresult = await SignupSem.findOne({ otp });
    // Send proper response
    if (updateResult.modifiedCount > 0) {
      return res.status(200).json({ message: "OTP verified successfully", finalresult });
    } else {
      return res.status(200).json({ message: "Already verified", finalresult });
    }

  } catch (error) {
    console.error("Error in handleOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

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
