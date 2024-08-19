const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

const catchAsync = require('../util/AsyncCatch');

exports.checkCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ userId: req.user.id });

  req.cart = cart;

  if (cart.length === 0) {
    return res.status(200).json({
      message: 'Your Cart is empty'
    });
  }
  next();
});

exports.getAllCartItems = catchAsync(async (req, res, next) => {
  res.status(200).json({
    Status: 'Success',
    Results: req.cart[0].items.length,
    Data: {
      cart: req.cart[0].items
    }
  });
});

exports.modifyCartQunt = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const { newQuantity } = req.body;
  const product = req.cart[0].items.find(
    el => el.productId._id.toString() === productId
  );

  if (product) {
    product.quantity = newQuantity;

    req.cart[0].save();
    return res.status(200).json({
      status: 'Success',
      message: `Product Quantity Updated to ${newQuantity}`
    });
  }
});

exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  req.cart[0].items = req.cart[0].items.filter(
    el => el.productId._id.toString() !== productId
  );
  req.cart[0].save();
  return res.status(204).json({
    status: 'Success',
    message: 'Product Deleted!'
  });
});

exports.addCartItem = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  const { newQuantity } = req.body;

  const addedProduct = {
    productId: productId,
    quantity: newQuantity
  };

  req.cart[0].items.push(addedProduct);
  req.cart[0].save();

  return res.status(200).json({
    status: 'Success',
    message: 'Product Added!'
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { userId, items } = req.cart[0];
  const {
    shippingTracking,
    orderStatus,
    shippingAddress,
    telephone,
    Username
  } = req.body;
  console.log(userId, items);
  // const orderKeys = ['name', 'price', 'description', 'images', 'quantity'];
  const newOrder = await Order.create({
    userId,
    items,
    shippingTracking,
    orderStatus,
    shippingAddress,
    telephone,
    Username
  }).populate('items');

  res.status(200).json({
    status: 'succeess',
    data: newOrder
  });
});
