const express = require("express");
const app = express();
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");

app.use(morgan("dev"));

app.use("/api/users", userRouter);

module.exports = app;
