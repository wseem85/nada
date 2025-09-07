const mongoose = require('mongoose');
const Artwork = require('./artworkModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review Can not be empty'],
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating Must be at least 1'],
      max: [5, 'Rating Must be equal or below 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    artwork: {
      // parent referencing to Tour Model
      type: mongoose.Schema.ObjectId,
      ref: 'Artwork',
      required: [true, 'A review must belong to an Artwork'],
    },
    user: {
      type: mongoose.Schema.ObjectId, //Parent referencing to User model
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ artwork: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (artworkId) {
  // remember this=Review model
  const stats = await this.aggregate([
    {
      $match: { artwork: artworkId }, // scan reviews collection and filter using this artworkId id
    },
    {
      $group: {
        _id: '$artwork', // group using the artwork field , each reviews of a specific artwork are grouped together
        nRating: { $sum: 1 }, // add  each time a new entry enter the group
        avgRating: { $avg: '$rating' }, // calculating the avg values of rsting field of each group
      },
    },
  ]);

  await Artwork.findByIdAndUpdate(artworkId, {
    votes: stats[0].nRating,
    avgRating: stats[0].avgRating,
  });
};
// Middleware to update ratings after save
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.artwork);
});

// Middleware to update ratings after update/delete
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.artwork);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
