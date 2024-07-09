const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });
    token = signToken(user._id);
    res.status(201).json({
      Status: "Success",
      token,
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new Error("There is no email or password"));

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.checkPassword(password, user.password)))
      return next(new Error("Wronge email or password"));
    token = signToken(user._id);
    res.status(201).json({
      Status: "Success",
      token,
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new Error("Please Login to complete!"));
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new Error("error!!!"));
  };
  next();
};
