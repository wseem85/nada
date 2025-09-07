const mongoose = require('mongoose');
require('dotenv/config.js');
const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database Connected'));

  await mongoose.connect(`${process.env.MONGODB_URI}/nadart`);
};
module.exports = connectDB;
