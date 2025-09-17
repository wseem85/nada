const fs = require('fs');
require('dotenv').config();
const Artwork = require('../../models/artworkModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const Order = require('../../models/orderModel');
const connectDB = require('../../config/mongodb');

const artworks = JSON.parse(fs.readFileSync(`${__dirname}/artworks.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`));

const importData = async () => {
  try {
    await Artwork.create(artworks);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    await Order.create(orders);
    console.log(' Data imported successfully ');
    process.exit();
  } catch (err) {
    console.log(`Err importing Data: ${err}`);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Artwork.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    console.log(`Data deleted successfully`);
    process.exit();
  } catch (err) {
    console.log(`Err Deleting Data: ${err}`);
  }
};

const run = async () => {
  await connectDB();
  if (process.argv[2] === '--import') {
    await importData();
  }
  if (process.argv[2] === '--delete') {
    await deleteData();
  }
};

run();
