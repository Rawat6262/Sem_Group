const express = require("express");
const   router = express.Router();
const signupController = require("../controller/user.Controller");
const {handleappotp} = require('../controller/user.Controller')
const { addProduct } = require("../controller/product.controller");
const { createWarehouse } = require("../controller/warehouse.controller");

router.post("/signup", signupController.createSignup);
router.post("/otp", handleappotp);
router.get("/signup", signupController.getAllUsers);
router.get("/signup/:id", signupController.getUserById);
router.put("/signup/:id", signupController.updateUser);
router.delete("/signup/:id", signupController.deleteUser);
router.post("/warehouse",createWarehouse)
router.put("/warehouse/:id/add-product",addProduct)
module.exports = router;
