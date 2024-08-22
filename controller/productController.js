const Product = require("../models/productModel");
const catchAsync = require("../util/AsyncCatch");
const AppError = require("./../util/AppError");

// Retrieve all products from the database
exports.getallProduct = catchAsync(async (req, res, next) => {
  // Optionally filtered by query parameters, and returns them to the clien.
  const product = await Product.find(req.query);

  // Send a 200 OK HTTP status response.
  res.status(200).json({
    status: "success",
    results: product.length,
    date: {
      product,
    },
  });
});

// Retrieve a single product from the database by its ID, and populates its associated reviews.
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate(
    "reviews"
  );

  // If no product is found.
  if (!product) {
    return next(new AppError("No product found with that id", 404));
  }

  // Send a 200 OK HTTP status response.
  res.status(200).json({
    status: "success",
    date: {
      product,
    },
  });
});

// Allow an admin or authorized user to create a new product in the database.
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  // Send a 201 Created HTTP status response.
  res.status(201).json({
    status: "success",
    date: {
      product: newProduct,
    },
  });
});

// Allow an admin or authorized user to update an existing product in the database.
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  // Send a 200 OK HTTP status response.
  res.status(200).json({
    status: "success",
    date: {
      product,
    },
  });
});

// Allow an admin or authorized user to delete an existing product from the database.
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  // If no product is found.
  if (!product) {
    return next(new AppError("No product found with that id", 404));
  }

  // Send a 204 No Content HTTP status response.
  res.status(204).json({
    status: "success",
    data: null,
  });
});
