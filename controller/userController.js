const User = require("../models/userModel");
const catchAsync = require("../util/AsyncCatch");
const AppError = require("../util/AppError");

// Return a new object with only the allowed properties.
const filterObj = (obj, ...allowedFields) => {
  // Create a new object to store filtered fields.
  const newObj = {};
  // Iterate over the keys of the original object.
  Object.keys(obj).forEach((el) => {
    // If the key is included in allowedFields, add it to newObj.
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  // Return the filtered object
  return newObj;
};

// Retrieve all users from the database.
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // Send a 200 OK response with the status
  res.status(200).json({
    Status: "Success",
    Results: users.length,
    Data: {
      users,
    },
  });
});

// Retrieve a single user by their ID from the database.
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // If the user is not found, it returns a 404 error.
  if (!user) return next(new AppError("User Not Found", 404));
  // Send a 200 OK response with the status
  res.status(200).json({
    Status: "Success",
    Data: {
      user,
    },
  });
});

// Delete a user by their ID from the database.
exports.deleteUserById = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  // Send a response with a 204 No Content status to indicate successful deletion.
  res.status(204).json({
    Status: "Success",
  });
});

// Function returns the currently authenticated user's data.
exports.getMe = catchAsync(async (req, res, next) => {
  // Send a 200 OK response with the status
  res.status(200).json({
    status: "Success",
    User: req.user,
  });
});

//  Update the current user's profile information.
exports.updateMe = catchAsync(async (req, res, next) => {
  // Check for password fields in the request body
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /me/updatePass.",
        400
      )
    );
  }

  // Filter the request body to include only allowed fields.
  const filteredBody = filterObj(req.body, "name", "email");

  // Update the user's profile with the filtered fields.
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // Send a success response with the updated user data.
  res.status(200).json({
    status: "Success",
    User: updatedUser,
  });
});
