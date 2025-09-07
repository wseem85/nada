- create `server.js` file
- run `npm init`
- install

```
 npm i express mongoose multer bcrypt cloudinary cors dotenv jsonwebtoken nodemon validator
```

- create the server

```
server.js
const express = require('express');
const cors = require('cors');
require('dotenv/config.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
<!-- CORS (Cross-Origin Resource Sharing) is a security mechanism that allows or restricts web pages from making requests to a domain different from the one that served the web page -->

app.get('/', (req, res) => {
  res.send('API working');
});

app.listen(PORT, () =>
  console.log('App rtunning and listenng on port: ', PORT)
);

```

- creating a database
  on the Atlas create a new database then copy connect URI and save it to `.env`

```
MONGODB_URI=mongodb+srv://nada:t96Z6lDghHjd7pIB@cluster0.1mhdpzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

```

- crete a function connect server to database and call it in app

```
// config/mongodb.js
const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database Connected'));
  await mongoose.connect(`${process.env.MONGODB_URI}/nadart`);
};
module.exports = connectDB;

```

ANd call in in your server

```
// server.js
const connectDB = require('./config/mongodb');
connectDB()
```

- Now if you run `nodemon server.js` you should get

```
App rtunning and listenng on port:  4000
Database Connected
```

- set cloudinary storage for your pictures , go to your cloudinary account , create a new API key and from there copy these to your enviroment

```
//.env
CLOUDINARY_NAME=dzqey4oms
CLOUDINARY_API_KEY=655176461391768
CLOUDINARY_SECRET_KEY=LqgT9DHtIXOYqpLfvt3WnscIGJI
```

Now you are ready to set up cloudinary configuration in your server

```
// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

module.exports = connectCloudinary;

```

and call this in your app

```
// server.js
const connectCloudinary = require('./config/cloudinary');
..
..
connectDB();
connectCloudinary();
..
..

```
