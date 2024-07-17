const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../util/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role
    });
    const token = signToken(user._id);
    res.status(201).json({
      Status: 'Success',
      token
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
      return next(new Error('There is no email or password'));

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.checkPassword(password, user.password)))
      return next(new Error('Wronge email or password'));
    const token = signToken(user._id);
    res.status(201).json({
      Status: 'Success',
      token
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    // 1) check if the user is loged in.
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1];
    if (!token) return next(new Error('Please Login to complete!'));

    // 2) check if the token is verfiyed.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return next(new Error('Invalid Token!'));
        return decoded;
      }
    );

    // 3) check if the user is still in the database.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new Error('This user is not Exist'));

    // 4) verfiy password hasn't changed
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new Error('User recently changed password! Please log in again.')
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new Error("This User Can't Access this URL!"));
    next();
  };
};

exports.forgetPass = async (req, res, next) => {
  try {
    // check if there is a user with the given email
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return next(new Error('There is no user registered with this email!!'));

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/users/resetpassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new Error('Email sending Error!'));
    }
  } catch (err) {
    console.log(err);
  }
};

exports.resetPass = async (req, res, next) => {
  try {
    // 1- hash the token in the link!
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2- find the user from the token!
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) return next(new Error('The token is expired!'));

    // 3- change the user password and save!
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4- return the resposne to the client!
    const token = signToken(user._id);
    res.status(201).json({
      Status: 'Success',
      token
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

exports.updatePass = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ email: req.user.email }).select(
      '+password'
    );
    if (
      !(await currentUser.checkPassword(
        req.body.currectPass,
        currentUser.password
      ))
    )
      return next(new Error('Your entered password is wrong!'));

    currentUser.password = req.body.newPassword;
    currentUser.passwordConfirm = req.body.newPasswordConfirm;
    await currentUser.save();

    const token = signToken(currentUser._id);
    res.status(201).json({
      Status: 'Success',
      token
    });
  } catch (err) {
    console.log(err);
  }
  next();
};
