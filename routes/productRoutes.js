const express = require("express");
const productController = require("../controller/productController");
const authController = require("../controller/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(productController.getallProduct)
  .post(
    authController.protect,
    authController.restrictedTo("admin"),
    productController.createProduct
  );

router
  .route("/id/:id")
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
