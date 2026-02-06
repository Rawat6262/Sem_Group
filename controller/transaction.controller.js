// const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");

/**
 * ✅ Create New Transaction
 */
const Transaction = require("../models/transaction.model");

/**
 * ✅ CREATE TRANSACTION (POST)
 */
exports.createTransaction = async (req, res) => {
  try {
    const {
      exhibition,
      category,
      labour,
      transporter,
      total_amount,
      paid_amount = 0,
      payment_mode,
      remark,
    } = req.body;

    if (!exhibition || !category || !total_amount) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (paid_amount > total_amount) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot exceed total",
      });
    }

    const transaction = await Transaction.create({
      exhibition,
      category,
      labour,
      transporter,
      total_amount,
      paid_amount,
      payment_mode,
      remark,
    });

    res.status(201).json({
      success: true,
      message: "Transaction created",
      data: transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * ✅ GET ALL TRANSACTIONS
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("exhibition", "name city")
      .populate("labour", "name phone_number")
      .populate("transporter", "transporter_name phone_number");

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * ✅ GET SINGLE TRANSACTION
 */
exports.getTransactionById = async (req, res) => {
  try {
    const data = await Transaction.findById(req.params.id)
      .populate("exhibition")
      .populate("labour")
      .populate("transporter");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * ✅ UPDATE TRANSACTION (findByIdAndUpdate)
 */
exports.updateTransaction = async (req, res) => {
  try {
    const update = req.body;

    // Prevent invalid payment
    if (
      update.paid_amount !== undefined &&
      update.total_amount !== undefined &&
      update.paid_amount > update.total_amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot exceed total",
      });
    }

    const data = await Transaction.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      message: "Transaction updated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * ✅ ADD PAYMENT (UPDATE PAID + PENDING)
 */
exports.addPayment = async (req, res) => {
  try {
    const { amount, payment_mode } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Get transaction first
    const transaction = await Transaction.findById(
      req.params.id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Remaining balance
    const remaining =
      transaction.total_amount -
      transaction.paid_amount;

    if (amount > remaining) {
      return res.status(400).json({
        success: false,
        message: `Only ₹${remaining} pending`,
      });
    }

    // Update using findByIdAndUpdate (middleware runs)
    const data = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { paid_amount: amount , pending_amount: -amount },
        ...(payment_mode && {
          $set: { payment_mode },
        }),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment added",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * ✅ DELETE TRANSACTION
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const data = await Transaction.findByIdAndDelete(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
