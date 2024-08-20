const express = require('express');

const router = express.Router();

const orderController = require('../controller/orderController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictedTo('admin'),
    orderController.getOrders
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictedTo('admin'),
    orderController.getOrder
  )
  .patch(
    authController.protect,
    authController.restrictedTo('admin'),
    orderController.modifyOrderStatus
  );

module.exports = router;
