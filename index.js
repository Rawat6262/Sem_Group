const express = require("express");
const mongoose = require("mongoose");
const router = require("./route/user.Router");
const Connection = require("./connection/user.Connection");
require("dotenv").config();

const app = express();
app.use(express.json()); // ✅ REQUIRED
app.use(express.urlencoded({ extended: true })); // optional but good

module.exports = app;

// Routes
app.use("/", router);

Connection(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
