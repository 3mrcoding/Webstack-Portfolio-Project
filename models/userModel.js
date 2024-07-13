const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User Must Have a Name!']
    },
    email: {
      type: String,
      required: [true, 'User Must Have a E-Mail!'],
      lowercase: true,
      unique: [true, 'This Email used in another account!'],
      validate: [validator.isEmail, 'Please provide a valid e-mail']
    },
    password: {
      type: String,
      required: [true, 'User Must Enter a Password!'],
      select: false
    },
    photo: String,
    passwordConfirm: {
      type: String,
      require: [true, 'Please confirm your password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { versionKey: false },
  { collection: 'users' }
);

userScheme.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userScheme.methods.checkPassword = async function(enteredPass, userPass) {
  return await bcrypt.compare(enteredPass, userPass);
};

userScheme.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userScheme);

module.exports = User;
