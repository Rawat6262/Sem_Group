const SignupSem = require("../models/signup.Model");
let nodemailer= require('nodemailer')
/**
 * CREATE SIGNUP
 */
exports.createSignup = async (req, res) => {
  try {
    let {full_name,gmail,mobile_number,city,state,country,address,gender,role,password} = req.body;
     let otp = "";
    for (let i = 0; i < 6; i++) {
      otp = Math.floor(100000 + Math.random() * 900000);
    }
    otp = Number(otp); // ensure it's a number

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "appdeveloper1208@gmail.com",
        pass: "woin wube avhm rkxg", // Gmail App password
      },
    });

    await transporter.sendMail({
      from: '"Onexhib App" <appdeveloper1208@gmail.com>',
      to: 'pctebca592@gmail.com',
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
      html: ` <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
        <h2 style="text-align:center; color:#2563eb;">🔐 Onexhib Account Verification</h2>
        <p style="font-size: 15px; color:#333;">Hello,</p>
        <p style="font-size: 15px; color:#333;">
          Thank you for signing up with <b>Onexhib</b> To complete your registration, please use the OTP code below:
        </p>

        <div style="text-align:center; margin: 20px 0;">
          <span style="display:inline-block; background:#2563eb; color:#fff; padding:10px 25px; border-radius:6px; font-size:22px; letter-spacing:2px; font-weight:bold;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color:#555;">
          ⚠️ This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.
        </p>

        <p style="font-size: 14px; color:#555;">If you didn’t request this verification, you can safely ignore this email.</p>

        <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;">
        <p style="text-align:center; font-size:12px; color:#777;">
          © ${new Date().getFullYear()} Onexhib App — All rights reserved.<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    </div>`,
    });


    console.log("Generated OTP:", otp);
    const user = await SignupSem.create({full_name,gmail,mobile_number,city,state,country,address,otp,role,gender,password});
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