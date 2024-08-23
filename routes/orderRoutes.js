const express = require('express');

const router = express.Router();

const orderController = require('../controller/orderController');
const authController = require('../controller/authController');

router.route('/').get(orderController.getOrderHistory);
router
  .route('/:id')
  .patch(
    authController.restrictedTo('admin'),
    orderController.modifyOrderStatus
  );

router
  .route('/all')
  .get(authController.restrictedTo('admin').orderController.getOrders);

router.route('/tracking/:id').get(orderController.getOrderStatus);

module.exports = router;
