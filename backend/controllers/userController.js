const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Multer configuration for memory storage
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to upload single file
exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      filteredObj[el] = obj[el];
    }
  });
  return filteredObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

// Upload photo to cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder: 'user_profiles',
          transformation: [
            { width: 500, height: 500, crop: 'fill' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(file.buffer);
  });
};

// Update Me API
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password.',
        400
      )
    );
  }

  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'phone',
    'address',
    'bio',
    'dob',
    'gender'
  );

  // 3) Handle photo upload if present
  if (req.file) {
    try {
      const uploadResult = await uploadToCloudinary(req.file);
      filteredBody.photo = uploadResult.secure_url;
    } catch (error) {
      return next(
        new AppError('Failed to upload image. Please try again.', 400)
      );
    }
  }

  // 4) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Delete Me API
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const userCart = await User.findById(req.user._id).select('cart').populate({
    path: 'cart.artwork', // Path to populate
    select: 'title price images discount available width height createdAt',
  });

  const cart = userCart.cart;

  res.status(200).json({
    status: 'success',
    cart,
  });
});
exports.updateCart = catchAsync(async (req, res, next) => {
  const cart = await User.findByIdAndUpdate(
    req.user._id,
    { cart: req.body.cart },
    {
      runValidators: true,
      new: true,
    }
  ).populate({
    path: 'cart.artwork',
    select: 'title price images discount available width height createdAt',
  });
  console.log(cart);
  res.status(200).json({
    status: 'success',
    data: cart,
  });
});
