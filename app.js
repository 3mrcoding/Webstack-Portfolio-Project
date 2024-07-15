const express = require('express');

const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

module.exports = app;
