const express = require('express');

const router = express.Router();
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');

router.route('/').get(cartController.getAllCartItems);

router
  .route('/product/:id')
  .patch(cartController.modifyCartQunt)
  .delete(cartController.deleteCartItem)
  .post(cartController.addCartItem);

router
  .route('/order')
  .get(orderController.getOrder)
  .post(orderController.createOrder);

module.exports = router;
