const User = require("../models/userModel");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    console.log(req.headers);
    res.status(200).json({
      Status: "Success",
      Results: users.length,
      Data: {
        users,
      },
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
        Status: "Failed",
        message: "User Not Found!",
      });
    }
    res.status(200).json({
      Status: "Success",
      Data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      Status: "Success",
    });
  } catch (err) {
    console.log(err);
  }
  next();
};
