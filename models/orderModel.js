const mongoose = require('mongoose');

const orderScheme = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        name: {
          type: String,
          required: true
        },
        description: String,
        price: {
          type: Number,
          required: true,
          min: 0
        },
        image: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    totalCost: {
      type: Number,
      // required: true,
      min: 0
    },
    shippingTracking: {
      type: String,
      enum: ['Out For Delivery', 'With Courier', 'Shipped', 'Prepaired'],
      default: 'Prepaired'
    },
    orderStatus: {
      type: String,
      enum: ['Order Received', 'Cancelled', 'Delivered', 'Ready'],
      default: 'Ready'
    },
    shippingAddress: {
      type: String
      // required: true
    },
    telephone: Number,
    Username: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderScheme);

module.exports = Order;
