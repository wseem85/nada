const express = require('express');
const cors = require('cors');
const qs = require('qs');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
// const multer = require('multer');
const connectDB = require('./config/mongodb');
const connectCloudinary = require('./config/cloudinary');
const { webhookCheckout } = require('./controllers/webhookController');
const artworkRouter = require('./routes/artworkRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const adminRouter = require('./routes/adminRouter');
const orderRouter = require('./routes/orderRouter');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { protect, restrictTo } = require('./controllers/authController');
const app = express();
app.set('trust proxy', true);
// app.use(mongoSanitize());
app.set('query parser', (str) => {
  return qs.parse(str, {
    allowDots: true, // This allows dot notation like 'avgRating.gte'
    comma: true, // This allows comma-separated arrays
    depth: 10, // Set appropriate depth for nested objects
  });
});

const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.post(
  '/api/user/stripe-webhook',

  express.raw({ type: 'application/json' }),
  webhookCheckout
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'), false);
//     }
//   },
// });
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://nadaart.onrender.com',
      'https://nadaart-admin.onrender.com',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// app.use(
// helmet()
// 	{
//   contentSecurityPolicy: {
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       'script-src': [
//         "'self'",
//         'https://js.stripe.com',
//         'https://m.stripe.network',
//       ],
//       'connect-src': [
//         "'self'",
//         'https://api.stripe.com',
//         'ws://localhost:*/', // For webpack dev server
//         'ws://127.0.0.1:*/', // For local development
//       ],
//       'frame-src': [
//         "'self'",
//         'https://js.stripe.com',
//         'https://hooks.stripe.com',
//       ],
//       'img-src': ["'self'", 'https://*.cloudinary.com', 'data:'],
//     },
//   },
// }
// );
// app.use(xss());

app.get('/', (req, res) => {
  res.send('API working');
});
const limitter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limitter);

app.use('/api/artworks', artworkRouter);
app.use('/api/users', userRouter);
app.use('/api/admin/reviews', protect, restrictTo('admin'), reviewRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRouter);

// handle unhandled routes
// any request reach this point  means there is no match route for it
// this middleware will just create an error and pass it to the next middleware
console.log(process.env.NODE_ENV);
app.use((req, res, next) => {
  next(
    new AppError(`can not find ${req.originalUrl} , it may be not defined`, 404)
  );
});

//this middleware sends back the error as a response to the client
app.use(globalErrorHandler);
const server = app.listen(PORT, () =>
  console.log('App rtunning and listenng on port: ', PORT)
);

process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION!', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on('uncaughtException', (err) => {
  console.log('💥 UNCAUGHT EXCEPTION!', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
