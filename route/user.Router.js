const express = require("express");
const   router = express.Router();
const signupController = require("../controller/user.Controller");
// const {handleappotp} = require('../controller/user.Controller')
const { addProduct, getproduct, addProductInwarehouse } = require("../controller/product.controller");
const { createWarehouse, getwarehouse } = require("../controller/warehouse.controller");

router.post("/signup", signupController.createSignup);
router.post("/otp", signupController.handleappotp);
router.post("/login", signupController.handleapplogin);
router.get("/signup", signupController.getAllUsers);
router.get("/signup/:id", signupController.getUserById);
router.put("/signup/:id", signupController.updateUser);
router.delete("/signup/:id", signupController.deleteUser);
router.post("/warehouse",createWarehouse)
router.get("/warehouse",getwarehouse)
router.post("/addproduct",addProduct)
router.get("/addproduct",getproduct)
router.put("/warehouse/:id/add-product",addProductInwarehouse)
module.exports = router;
