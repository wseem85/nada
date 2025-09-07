const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendLoginToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: false,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  console.log(newUser);
  createSendLoginToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please Provide your email and password ', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid Email or Passowrd', 401));
  }
  createSendLoginToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. First, check for token in HTTP-only cookie (your current approach)
  if (req.cookies && req.cookies.jwt) {
    console.log(req.cookies.jwt);
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You must log in to perform this action', 401));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  console.log(decodedToken);
  // check if the user still exist
  const currentUser = await User.findById({ _id: decodedToken.id });
  if (!currentUser) {
    return next(new AppError('This user is not exist anymore', 401));
  }

  // check if the user changed password after the token is isuued
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(new AppError('User changed password , Log in again '));
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('You do not have permissions to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no account belong to this email', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

  const message = `Forgot Your password? Follow the link ${resetUrl}.\n ANd submit your new password and the passwordConfirm ,If you didnt forgot your password please ignore this message`;
  try {
    await sendMail({
      email: user.email,
      subject:
        'follow the link to update password , the reset token valid for 10 minutes',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return new AppError('There was an error sending mail', 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(hashedToken);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new AppError('This User no longer exists or token is expired', 400)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  createSendLoginToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const correct = await user.correctPassword(currentPassword, user.password);
  if (!correct) {
    return next(new AppError('You entered wrong  current password ', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  createSendLoginToken(user, 200, res);
});

// controllers/authController.js
exports.getMe = catchAsync(async (req, res, next) => {
  // The protect middleware already ran and set req.user
  // So we just need to return the user data

  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'dummynotvalidcookie', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 1000, // 10 seconds
  });

  res.status(200).json({
    status: 'success',
  });
};
