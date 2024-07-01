const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));

app.use("/", (req, res, next) => {
  res.send("Hello World!");
  next();
});

module.exports = app;
