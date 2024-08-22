const Order = require("../models/orderModel");
const catchAsync = require("../util/AsyncCatch");
const AppError = require("../util/AppError");

// creating an order based on the user's cart.
exports.createOrder = catchAsync(async (req, res, next) => {
  // It extracts necessary order details from request body.
  const { shippingAddress, telephone, Username } = req.body;

  const items = req.cart[0].items.map((item) => ({
    name: item.productId.name,
    price: item.productId.price,
    description: item.productId.description,
    image: item.productId.images,
    quantity: item.quantity,
  }));

  // Create a new order for the authenticated user
  const newOrder = await Order.create({
    userId: req.user.id,
    items,
    shippingAddress,
    telephone,
    Username,
  });

  res.status(200).json({
    status: "Success",
    data: newOrder,
  });
});

// Retrieve all the orders from the database and returns them to the client
exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  // Handle the case where no orders are found
  if (!orders) {
    return next(new AppError("No order found with that ID", 404));
  }

  res.status(200).json({
    status: "Success",
    orders,
  });
});

// Retrieve a specific order from the database by the authenticated user's ID
exports.getOrder = catchAsync(async (req, res, next) => {
  let order;
  req.params.id
    ? // If req.params.id exists, the function uses it to search for an order by its ID using Order.findById(req.params.id)
      (order = await Order.findById(req.params.id))
    : // If req.params.id is not provided, the function retrieves the order belonging to the authenticated user.
      (order = await Order.findOne({ userId: req.user.id }));

  // If no order is found, the function triggers an error using AppError with a 404 status code.
  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }

  res.status(200).json({
    status: "Success",
    order,
  });
});

// Update the status and shipping tracking information of an order.
exports.modifyOrderStatus = catchAsync(async (req, res, next) => {
  const { shippingTracking, orderStatus } = req.body;

  // Searche for the order by its ID (req.params.id) using 'findByIdAndUpdate()' and updates the fields
  const modifiedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { shippingTracking, orderStatus },
    // ensure the updated order is returned rather than the pre-update version. The data is validated against the schema before saving.
    { new: true, runValidators: true }
  );

  // If the order is not found, the function trigger an error using AppError with a 404 status code.
  if (!modifiedOrder) {
    return next(new AppError("No order found with that ID", 404));
  }

  res.status(200).json({
    status: "Success",
    order: modifiedOrder,
  });
});
