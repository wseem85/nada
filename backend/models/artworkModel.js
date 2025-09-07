const mongoose = require('mongoose');
const slugify = require('slugify');

const artworkSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'each artwork must have a title'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'An artwork title must be not more than 40 charachters length ',
      ],
      minLength: [
        10,
        'An artwork title must be at leat 10 charachters length ',
      ],
    },
    slug: String,
    images: {
      type: [String],
      // validate: {
      //   validator: function (arr) {
      //     return arr.length === 3;
      //   },
      //   message: 'Images array must contain exactly 3 elements',
      // },
    },
    width: {
      type: Number,
      required: ['true', 'Artwork must have a width'],
    },
    height: {
      type: Number,
      required: ['true', 'Artwork must have a width'],
    },
    categories: [String],
    price: {
      type: Number,
      required: [true, 'Artwork must have a price'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Discount must be less than price, , you provided ({VALUE}) as discount ',
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'rating must be below 5.0'],
      get: (val) => Math.round(val * 10) / 10,
    },
    description: {
      type: String,
      minLength: [100, 'Description is too short '],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true, getters: true }, toObject: { virtuals: true } }
);
artworkSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'artwork',
  localField: '_id',
});
artworkSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
