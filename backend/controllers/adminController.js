const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Artwork = require('../models/artworkModel');
const Order = require('../models/orderModel');

const Review = require('../models/reviewModel');
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendLoginToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // true in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin
    maxAge: 60 * 24 * 60 * 60 * 1000,
  };
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// POST /api/admin/login
exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (user.role !== 'admin') {
    return next(new AppError('Only admins can access this area', 403));
  }

  createSendLoginToken(user, 200, res);
});

exports.logoutAdmin = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const dummyToken = 'dummynotvalidcookie';
  res.cookie('jwt', dummyToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 10 * 1000, // 10 seconds
  });
  req.user.role = undefined;

  res.status(200).json({
    status: 'success',
    dummyToken: dummyToken,
  });
};

exports.getStoreStats = catchAsync(async (req, res, next) => {
  const artworksStats = await Artwork.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        inStore: {
          $sum: { $cond: [{ $eq: ['$available', true] }, 1, 0] },
        },
        soldOut: {
          $sum: { $cond: [{ $eq: ['$available', false] }, 1, 0] },
        },
        deleted: {
          $sum: { $cond: [{ $eq: ['$deleted', true] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        inStore: 1,
        soldOut: 1,
        deleted: 1,
      },
    },
  ]);
  const ordersStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        delevered: {
          $sum: { $cond: [{ $eq: ['$status', 'delevered'] }, 1, 0] },
        },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        paid: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        delevered: 1,
        pending: 1,
        paid: 1,
      },
    },
  ]);
  const totalUsers = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
  ]);
  const topFans = await Review.aggregate([
    // Stage 1: Group reviews by user and count them
    {
      $group: {
        _id: '$user',
        reviewCount: { $sum: 1 },
      },
    },
    // Stage 2: Sort users by review count (descending)
    {
      $sort: { reviewCount: -1 },
    },
    // Stage 3: Limit to top 3 users
    {
      $limit: 3,
    },
    // Stage 4: Lookup to get user details from User collection
    {
      $lookup: {
        from: 'users', // Make sure this matches your User collection name
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    // Stage 5: Unwind the userDetails array
    {
      $unwind: '$userDetails',
    },
    // Stage 6: Project only the fields we want
    {
      $project: {
        _id: 0,
        userId: '$_id',
        reviewCount: 1,
        name: '$userDetails.name',
        photo: '$userDetails.photo',
      },
    },
  ]);
  const ratingStats = await Review.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        rating5: {
          $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] },
        },
        rating4: {
          $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] },
        },
        rating3: {
          $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] },
        },
        rating2: {
          $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] },
        },
        rating1: {
          $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        rating5: 1,
        rating4: 1,
        rating3: 1,
        rating2: 1,
        rating1: 1,
      },
    },
  ]);
  const topCustomers = await Order.aggregate([
    // Stage 1: Group orders by customer and count them
    {
      $group: {
        _id: '$user', // Assuming the field is called "customer" in your Order model
        orderCount: { $sum: 1 },
      },
    },
    // Stage 2: Sort customers by order count (descending)
    {
      $sort: { orderCount: -1 },
    },
    // Stage 3: Limit to top 3 customers
    {
      $limit: 3,
    },
    // Stage 4: Lookup to get customer details from User collection
    {
      $lookup: {
        from: 'users', // Make sure this matches your User collection name
        localField: '_id',
        foreignField: '_id',
        as: 'customerDetails',
      },
    },
    // Stage 5: Unwind the customerDetails array
    {
      $unwind: '$customerDetails',
    },
    // Stage 6: Project only the fields we want
    {
      $project: {
        _id: 0,
        customerId: '$_id',
        orderCount: 1,
        name: '$customerDetails.name',
        email: '$customerDetails.email',
        photo: '$customerDetails.photo',
        // Add any other user fields you want to include
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      artworksStats,
      ordersStats,
      totalUsers,
      topFans,
      ratingStats,
      topCustomers,
    },
  });
});


