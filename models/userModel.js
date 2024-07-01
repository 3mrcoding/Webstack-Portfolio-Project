const mongoose = require("mongoose");
const validator = require("validator");

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User Must Have a Name!"],
  },
  email: {
    type: String,
    required: [true, "User Must Have a E-Mail!"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid e-mail"],
  },
  password: {
    type: String,
    required: [true, "User Must Enter a Password!"],
  },
  photo: String,
  passwordConfirm: {
    type: String,
    require: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
});
