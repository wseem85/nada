const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const isReview = Model.modelName === 'Review';
    const preDeleteDoc = isReview ? await Model.findById(req.params.id) : null;
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(AppError(`No ${Model} found with this id`, 404));
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

exports.updateOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const isReview = Model.modelName === 'Review';
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
    res.status(204).json({
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
    console.log(Model.modelName);
    if (req.params.workId) filter = { artwork: req.params.workId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();

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
