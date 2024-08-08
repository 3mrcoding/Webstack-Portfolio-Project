const express = require("express");
const productController = require("../controller/productController");

const router = express.Router();

router
  .route("/")
  .get(productController.getallProduct)
  .post(
    authController.protect,
    authController.restrictedTo("admin"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictedTo("admin"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictedTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
