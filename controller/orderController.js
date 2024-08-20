const Order = require('../models/orderModel');
const catchAsync = require('../util/AsyncCatch');
const AppError = require('../util/AppError');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, telephone, Username } = req.body;

  const items = req.cart[0].items.map(item => ({
    name: item.productId.name,
    price: item.productId.price,
    description: item.productId.description,
    image: item.productId.images,
    quantity: item.quantity
  }));

  const newOrder = await Order.create({
    userId: req.user.id,
    items,
    shippingAddress,
    telephone,
    Username
  });

  res.status(200).json({
    status: 'Success',
    data: newOrder
  });
});
exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    orders
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  let order;
  req.params.id
    ? (order = await Order.findById(req.params.id))
    : (order = await Order.findOne({ userId: req.user.id }));

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    order
  });
});

exports.modifyOrderStatus = catchAsync(async (req, res, next) => {
  const { shippingTracking, orderStatus } = req.body;

  const modifiedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { shippingTracking, orderStatus },
    { new: true, runValidators: true }
  );

  if (!modifiedOrder) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    order: modifiedOrder
  });
});
