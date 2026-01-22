const express = require("express");
const   router = express.Router();
const signupController = require("../controller/user.Controller");
// const {handleappotp} = require('../controller/user.Controller')
const { addProduct, getproduct, addProductInwarehouse, updateproduct, outgoingexhibitionproduct } = require("../controller/product.controller");
const { createWarehouse, getwarehouse, getWarehouseProducts } = require("../controller/warehouse.controller");

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
router.put("/updateproduct",updateproduct)
router.put("/updateproduct/:id",updateproduct);
router.put("/outgoingexhibitionproduct/:id",outgoingexhibitionproduct);
router.put("/warehouse/:id/add-product",addProductInwarehouse)
router.get("/warehouse/:warehouseId/products", getWarehouseProducts);
const categoryController = require("../controller/category.controller");

// CRUD Routes
router.post("/category", categoryController.createCategory);
router.get("/category", categoryController.getCategories);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);
// routes/vendor.routes.js

const vendorController = require("../controller/vendor.controller");

router.post("/addvendor", vendorController.createVendor);
router.get("/getvendor", vendorController.getAllVendors);
router.get("/getvendorbyid/:id", vendorController.getVendorById);
router.put("/updatevendor/:id", vendorController.updateVendor);
router.delete("/deletevendor/:id", vendorController.deleteVendor);
const clientController = require("../controller/client.controller");
router.post("/createclient", clientController.createClient);
router.get("/getclient", clientController.getAllClients);
router.get("/getsingleclient/:id", clientController.getClientById);
router.put("/updateclient/:id", clientController.updateClient);
router.delete("/deleteclient/:id", clientController.deleteClient);  

const exhibitionController = require("../controller/exhibition.controller");

// CRUD Routes
router.post("/createexhibition", exhibitionController.createExhibition);
router.get("/getexhibitions", exhibitionController.getAllExhibitions);
router.get("/getsingleexhibition/:id", exhibitionController.getExhibitionById);
router.put("/updateexhibition/:id", exhibitionController.updateExhibition);
router.delete("/deleteexhibition/:id", exhibitionController.deleteExhibition);
router.put("/exhibition/:id/add-client",exhibitionController.addclient) 
const {
  createDesign,
  getAllDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getDesignsByClient,
  makeDesignFinal,
} = require("../controller/design.controller");

 router.post("/createdesign/:taken_by", createDesign);
router.get("/getalldesign", getAllDesigns);
router.get("/getdesignbyid/:id", getDesignById);
router.get("/clientdesign/:taken_by", getDesignsByClient);
router.put("/updatedesign/:id", updateDesign);
router.delete("/deletedesign/:id", deleteDesign);
router.patch("/finaldesign/:id", makeDesignFinal);
const {
  createTransporter,
  getAllTransporters,
  getTransporterById,
  updateTransporter,
  deleteTransporter,
} = require("../controller/transporter.controller");

router.post("/createtransporter", createTransporter);
router.get("/gettransporter", getAllTransporters);
router.get("/getsingletransporter/:id", getTransporterById);
router.put("/updatetransporter/:id", updateTransporter);
router.delete("/deletetransporter/:id", deleteTransporter);
// const controller = require("../controller/outgoingdocument.controller.js");
// const controller2 = require("../controller/incomingd0cument.controller.js");
let controller2 = require("../controller/outgoingdocument.controller.js");
let controller = require("../controller/incomingd0cument.controller.js");
// router.post("/createincomingchallan", controller.createIncomingDeliveryChallan);
// router.get("/getallincomingchallan", controller.getAllIncomingDeliveryChallans);
// router.get("/getincomingchallan/:id", controller.getIncomingDeliveryChallanById);
router.post("/createincomingdocument",controller.createincomingDeliveryChallan);
router.post("/createoutgoingdocument", controller2.createoutgoingDeliveryChallan);

// module.exports = router;
module.exports = router;
