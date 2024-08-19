const Review = require("./../models/reviewModel");
const catchAsync = require("./../util/AsyncCatch");
const factory = require("./../controller/handlerFactory");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    date: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // To allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    date: {
      review: newReview,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
