const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');
const authController = require('../controller/authController');

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.getAllUsers
  );
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.getUserById
  )
  .delete(
    authController.protect,
    authController.restrictedTo('admin'),
    userController.deleteUserById
  );

router.route('/forgetpassword').patch(authController.forgetPass);
router.route('/resetpassword/:token').patch(authController.resetPass);

module.exports = router;
