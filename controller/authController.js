const User = require("../models/userModel");

exports.createUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    res.status(201).json({
      Status: "Success",
      user,
    });
  } catch (err) {
    console.log(err);
  }
  next();
};
