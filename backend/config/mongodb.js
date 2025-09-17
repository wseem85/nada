const mongoose = require('mongoose');
require('dotenv/config.js');
const connectDB = async () => {
  mongoose.connection.on('connected', async () => {
    console.log('Database Connected');
    console.log('Database name:', mongoose.connection.name); // Add this line
    try {
      // const collections = await mongoose.connection.db
      //   .listCollections()
      //   .toArray();
      // console.log('Collections in database:');
      // collections.forEach((collection) => {
      //   console.log(' -', collection.name);
      // });
      // Check document counts in each collection
      // console.log('\nDocument counts:');
      // for (const collection of collections) {
      //   const count = await mongoose.connection.db
      //     .collection(collection.name)
      //     .countDocuments();
      //   console.log(` - ${collection.name}: ${count} documents`);
      // }
    } catch (error) {
      console.log('Error checking collections:', error.message);
      process.exit(1);
    }
  });
  await mongoose.connect(`${process.env.MONGODB_URI}`);
};
module.exports = connectDB;
