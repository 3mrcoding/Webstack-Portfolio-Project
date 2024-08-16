const express = require('express');

const router = express.Router();
const cartController = require('../controller/cartController');

router.route('/').get(cartController.getAllCartItems);

router
  .route('/product/:id')
  .patch(cartController.modifyCartQunt)
  .delete(cartController.deleteCartItem)
  .put(cartController.addCartItem);

module.exports = router;
