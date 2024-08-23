const mongoose = require('mongoose');

const dotenv = require('dotenv');
const Cart = require('./models/cartModel'); // Adjust the path as necessary

// Define Environment Variables
dotenv.config({ path: './config.env' });

// Connecting DataBase
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB');
});

// Assume these IDs are retrieved from the database
const userId = '66a016ccdd260150574b2226'; // Example User ID
const productId1 = '66b661b25ea55e22cf06536b'; // Example Product ID 1
const productId2 = '66b661b25ea55e22cf06536e'; // Example Product ID 2

const newCart = new Cart({
  userId: userId,
  items: [
    {
      productId: productId1,
      quantity: 2
    },
    {
      productId: productId2,
      quantity: 1
    }
  ]
});

newCart
  .save()
  .then(cart => {
    // console.log('Cart saved:', cart);
    process.exit();
  })
  .catch(error => {
    console.error('Error saving cart:', error);
    process.exit();
  });
