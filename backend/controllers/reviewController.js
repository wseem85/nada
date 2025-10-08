const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.setWorkAndUserIds = (req, res, next) => {
  if (!req.body.artwork) req.body.artwork = req.params.workId;

  if (!req.body.user) req.body.user = req.user._id;

  next();
};
exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);
exports.getArtworkReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ artwork: req.params.workId })
    .populate({
      path: 'user',
      select: 'name photo',
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
