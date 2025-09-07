const Artwork = require('../models/artworkModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

// GET ALL API WITH FILTERING
exports.getAllArtworks = getAll(Artwork);

// POST ONE API
exports.createArtwork = createOne(Artwork);
// GET ONE API

exports.getArtwork = getOne(Artwork);

//  UPDATE ONE API
exports.updateArtwork = updateOne(Artwork);

// DELETE ONE API
exports.deleteArtwork = deleteOne(Artwork);

// GET STATS API
exports.getArtworksStata = catchAsync(async (req, res, next) => {
  const stats = await Artwork.aggregate([
    {
      $group: {
        _id: null,
        num: { $sum: 1 },
        numRatings: { $sum: '$votes' },
        averageRatings: { $avg: '$avgRating' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        maxRated: { $max: '$avgRating' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getSimilarArtworks = catchAsync(async (req, res, next) => {
  // 1. Get the current artwork using your existing factory logic if possible,
  // or just fetch it simply for its data.
  const currentArtwork = await Artwork.findById(req.params.id);
  if (!currentArtwork) {
    return next(new AppError('No artwork found with that ID', 404));
  }

  // 2. Use MongoDB Aggregation to find similar artworks efficiently
  const similarArtworks = await Artwork.aggregate([
    {
      $match: {
        _id: { $ne: currentArtwork._id }, // Exclude the current artwork
        available: true, // Optional: only show available ones
      },
    },
    // Add field for number of common categories
    {
      $addFields: {
        commonCategoriesCount: {
          $size: {
            $setIntersection: ['$categories', currentArtwork.categories],
          },
        },
        isPriceInRange: {
          $and: [
            { $gte: ['$price', currentArtwork.price - 300] },
            { $lte: ['$price', currentArtwork.price + 300] },
          ],
        },
      },
    },
    // Add a scoring system: prioritize category matches, then price
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ['$commonCategoriesCount', 10] }, // High weight for categories
            { $cond: [{ $eq: ['$isPriceInRange', true] }, 5, 0] }, // Lower weight for price
          ],
        },
      },
    },
    // Sort by score (most similar first)
    { $sort: { score: -1 } },
    // Limit the results
    { $limit: 8 },
  ]);

  // 3. Send the response
  res.status(200).json({
    status: 'success',
    results: similarArtworks.length,
    data: {
      data: similarArtworks, // Keeping your consistent response format
    },
  });
});
