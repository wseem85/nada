const Artwork = require('../models/artworkModel');
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
    // Special handling for Artwork to support partial image replacement via Cloudinary
    // if (isArtwork) {

    //   // Fetch current doc to read existing images
    //   const current = await Model.findById(req.params.id);

    //   if (!current) {
    //     return next(
    //       new AppError(`No ${Model.modelName} found with this id`, 404)
    //     );
    //   }

    //   // Body may be JSON (no image updates) or multipart (with optional images)
    //   let bodyData = req.body || {};
    //   console.log('req.body:', req.body);
    //   console.log('req.files:', req.files);
    //   if (req.is('multipart/form-data') && bodyData.data) {
    //     try {
    //       bodyData = JSON.parse(bodyData.data);
    //     } catch (e) {
    //       return next(
    //         new AppError('Invalid JSON in form-data field "data"', 400)
    //       );
    //     }
    //   }

    //   // Start from existing images
    //   const updatedImages = Array.isArray(current.images)
    //     ? [...current.images]
    //     : [];

    //   // Helper to extract cloudinary public_id from a secure_url
    //   const extractPublicId = (url) => {
    //     try {
    //       // Example: https://res.cloudinary.com/<cloud>/image/upload/v123/dir/name_publicid.webp
    //       const lastSegment = url.split('/').pop();
    //       if (!lastSegment) return null;
    //       // remove extension
    //       const withoutExt =
    //         lastSegment.split('.').slice(0, -1).join('.') || lastSegment;
    //       // If folders exist, we lost them. Try to capture path after '/upload/'
    //       const uploadIndex = url.indexOf('/upload/');
    //       if (uploadIndex !== -1) {
    //         const pathAfterUpload = url.substring(uploadIndex + 8); // after '/upload/'
    //         const parts = pathAfterUpload.split('/');
    //         // drop version segment starting with 'v'
    //         const filtered = parts.filter((p) => !/^v\d+/.test(p));
    //         const joined = filtered.join('/');
    //         const noExt = joined.split('.').slice(0, -1).join('.') || joined;
    //         return noExt;
    //       }
    //       return withoutExt;
    //     } catch (_) {
    //       return null;
    //     }
    //   };

    //   // Collect incoming replacements if any
    //   let indices = req.body?.['indices[]'] || req.body?.indices || [];
    //   // Normalize indices to array of numbers
    //   if (!Array.isArray(indices)) indices = [indices];
    //   indices = indices
    //     .map((i) => (typeof i === 'string' ? parseInt(i, 10) : i))
    //     .filter((i) => Number.isInteger(i) && i >= 0 && i < 3);

    //   // Multer stores files in req.files as an object with field names as keys
    //   const imageFiles = req.files?.['images[]'] || [];

    //   const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
    //   console.log('imageFiles:', imageFiles);
    //   console.log('filesArray:', filesArray);
    //   // If both arrays length mismatch, pair by min length
    //   const pairCount = Math.min(indices.length, filesArray.length);

    //   for (let k = 0; k < pairCount; k += 1) {
    //     console.log(`Processing pair ${k + 1}/${pairCount}`);
    //     const idx = indices[k];
    //     const fileObj = filesArray[k];
    //     if (typeof idx !== 'number' || !fileObj) continue;
    //     console.log(fileObj);
    //     const resizedBuffer = await sharp(fileObj.buffer)
    //       .resize(800, 950)
    //       .toFormat('webp')
    //       .toBuffer();
    //     // Upload new image to Cloudinary (multer stores in memory as buffer)
    //     const uploadResult = await uploadToCloudinary(resizedBuffer);
    //     console.log(uploadResult);
    //     // Attempt to delete old image if exists
    //     // const oldUrl = updatedImages[idx];
    //     // if (oldUrl) {
    //     //   const publicId = extractPublicId(oldUrl);
    //     //   if (publicId) {
    //     //     try {
    //     //       await cloudinary.uploader.destroy(publicId);
    //     //     } catch (e) {
    //     //       // non-fatal; continue
    //     //     }
    //     //   }
    //     // }

    //     // Replace with new secure URL
    //     updatedImages[idx] = uploadResult.secure_url;
    //   }

    //   // Build update payload
    //   const updatePayload = {
    //     ...bodyData,
    //   };
    //   if (pairCount > 0) {
    //     updatePayload.images = updatedImages;
    //   }

    //   const updated = await Model.findByIdAndUpdate(
    //     req.params.id,
    //     updatePayload,
    //     {
    //       new: true,
    //       runValidators: true,
    //     }
    //   );
    //   if (!updated) {
    //     return next(
    //       new AppError(`No ${Model.modelName} found with this id`, 404)
    //     );
    //   }
    //   return res.status(200).json({
    //     status: 'success',
    //     data: {
    //       data: updated,
    //     },
    //   });
    // }

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
