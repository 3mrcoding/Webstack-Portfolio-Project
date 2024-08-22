const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const catchAsync = require('../util/AsyncCatch');
const AppError = require('../util/AppError');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, telephone } = req.body;

  // Extracting and formatting cart items
  const items = req.cart[0].items.map(({ productId, quantity }) => ({
    name: productId.name,
    price: productId.price,
    description: productId.description,
    image: productId.images,
    quantity
  }));

  // Calculate the total cost of the order
  const totalCost = items.reduce(
    (accum, item) => accum + item.price * item.quantity,
    0
  );

  // Create a new order
  const newOrder = await Order.create({
    userId: req.user.id,
    items,
    shippingAddress,
    telephone,
    Username: req.user.name,
    totalCost
  });

  if (!(await Cart.findByIdAndDelete(req.cart[0].id))) {
    return new AppError('Your cart already empty');
  }
  // Respond to the client with the created order
  res.status(201).json({
    status: 'success',
    data: {
      order: {
        Username: newOrder.Username,
        shippingAddress: newOrder.shippingAddress,
        totalCost: newOrder.totalCost
      }
    }
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
