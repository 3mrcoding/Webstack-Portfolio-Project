const Product = require("../models/productModel");
const catchAsync = require("../util/AsyncCatch");
const AppError = require("./../util/AppError");

exports.getallProduct = catchAsync(async (req, res, next) => {
  const product = await Product.find(req.query);

  res.status(200).json({
    status: "success",
    results: product.length,
    date: {
      product,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    return next(new AppError("No product found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    date: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    date: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    date: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("No product found with that id", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
