const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setWorkAndUserIds,
  getReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user', 'admin'), setWorkAndUserIds, createReview);
router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user'), updateReview);

module.exports = router;
