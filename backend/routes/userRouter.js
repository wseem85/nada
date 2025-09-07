const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
// Add this after the checkout-session route
router.get(
  '/order-success',
  authController.protect,
  orderController.handleSuccessfulPayment
);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.post(
  '/checkout-session',
  authController.protect,
  orderController.getCheckoutSession
);
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/update-me',
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);

router.patch('/delete-me', authController.protect, userController.deleteMe);

router.get(
  '/get-all-users',
  authController.protect,
  userController.getAllUsers // Fixed: was 'gatAllUsers'
);

router.get('/me', authController.protect, authController.getMe);
router.get('/me/cart', authController.protect, userController.getCart);
router.patch('/me/cart', authController.protect, userController.updateCart);

module.exports = router;
