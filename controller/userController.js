const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      Status: 'Success',
      Results: users.length,
      Data: {
        users
      }
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        Status: 'Failed',
        message: 'User Not Found!'
      });
    }
    res.status(200).json({
      Status: 'Success',
      Data: {
        user
      }
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.deleteUserById = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      Status: 'Success'
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'Success',
      User: req.user
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    console.log(req.user._id);
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new Error(
          'This route is not for password updates. Please use /me/updatePass.'
        )
      );
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'Success',
      User: updatedUser
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'Error',
      message: err.message
    });
  }
};
