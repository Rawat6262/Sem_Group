const mongoose = require("mongoose");

const Signupschema = new mongoose.Schema({
    full_name: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile_number: { type: Number, required: true, },
    state: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ["labour", "employe", "transporter", "supervisor", "admin"],
    },
    otp: { type: Number},
    isapproved: { type: Boolean, default: false },
    gender: {
        type: String,
        required: true,
        enum: ["MALE", "FEMALE", "OTHERS"],
    },
}, { timestamps: true });

module.exports = mongoose.model("SignupSem", Signupschema);
