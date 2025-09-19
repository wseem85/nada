const Artwork = require('../models/artworkModel');
const Order = require('../models/orderModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const cloudinary = require('cloudinary').v2;
// const sharp = require('sharp');
// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: 'image', format: 'webp' },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
//     stream.end(buffer);
//   });
// };
exports.deleteOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const isReview = Model.modelName === 'Review';
    const isArtwork = Model.modelName === 'Artwork';

    const preDeleteDoc = isReview ? await Model.findById(req.params.id) : null;
    let doc;
    if (isArtwork) {
      await Model.findByIdAndUpdate(req.params.id, {
        deleted: true,
        deletedAt: Date.now(),
      });
      doc = await Model.findById(req.params.id);
    } else {
      doc = await Model.findByIdAndDelete(req.params.id);
    }
    if (!doc) {
      return next(new AppError(`No ${Model} found with this id`, 404));
    }
    if (isReview) {
      await Model.calcAverageRatings(preDeleteDoc.artwork);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
exports.rsizeAndUploadArtworkImages = catchAsync(function (req, res, next) {});
exports.updateOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const isReview = Model.modelName === 'Review';
    // const isArtwork = Model.modelName === 'Artwork';
    const preUpdateDoc = isReview ? await Model.findById(req.params.id) : null;

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(`No ${Model} found with this id`, 404));
    }
    if (isReview) {
      await Model.calcAverageRatings(preUpdateDoc.artwork);
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.createOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    if (
      Model.modelName === 'Review' &&
      (!req.body.rating || !req.body.review)
    ) {
      return next(
        new AppError('You missed rating or review ,pleas give us both', 400)
      );
    }

    const doc = await Model.create(req.body);

    // If creating a Review, update the artwork's average ratings before responding
    if (Model.modelName === 'Review') {
      await Model.calcAverageRatings(doc.artwork);
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.getOne = function (Model, populateOption) {
  return catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (populateOption) {
      query = query.populate(populateOption);
    }

    const doc = await query;
    if (!doc) {
      return next(new AppError(`No ${Model} found with this id`, 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.getAll = function (Model) {
  return catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    const totalDocuments = await Model.countDocuments(filter);

    if (req.params.workId) filter = { artwork: req.params.workId };
    let features;
    if (Model.modelName === 'Artwork') {
      features = new APIFeatures(Artwork.active().find(filter), req.query)
        .filter()
        .sort()
        .limitFields();
    } else if (Model.modelName === 'Order') {
      features = new APIFeatures(
        Order.find().populate({
          path: 'user',
          select: 'name email phone photo',
        }),
        req.query
      )
        .filter()
        .sort()
        .limitFields();
    } else {
      features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields();
    }
    // Clone the query to get total count AFTER filters but BEFORE pagination
    const totalCountQuery = features.query.clone();
    const totalFilteredCount = await totalCountQuery.countDocuments();

    // Now apply pagination to the original query
    features.paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      totalFilteredCount, // Total count AFTER filters
      totalDocuments: await Model.countDocuments(), // Total count in collection (optional)
      data: {
        data: doc,
      },
    });
  });
};
