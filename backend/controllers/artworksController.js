const Artwork = require('../models/artworkModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

const uploadToCloudinary = (buffer) => {
  console.log('start uploading');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', format: 'webp' },
      (error, result) => {
        if (error) {
          console.log('errrror');
          console.log(error);
          return reject(error);
        }
        console.log('success');
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// RESIZE AND UPLOAD EDITED ARTWORKS
exports.resizeANdUploadEditedArtworks = async function (req, res, next) {
  if (req.method !== 'PATCH') return next();

  const current = await Artwork.findById(req.params.id);

  if (!current) {
    return next(new AppError(`No ${Model.modelName} found with this id`, 404));
  }

  // Body may be JSON (no image updates) or multipart (with optional images)
  let bodyData = req.body || {};
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);

  if (req.is('multipart/form-data') && bodyData.data) {
    try {
      bodyData = JSON.parse(bodyData.data);
    } catch (e) {
      return next(new AppError('Invalid JSON in form-data field "data"', 400));
    }
  }

  // Start from existing images
  const updatedImages = Array.isArray(current.images)
    ? [...current.images]
    : [];

  // Helper to extract cloudinary public_id from a secure_url
  const extractPublicId = (url) => {
    try {
      // Example: https://res.cloudinary.com/<cloud>/image/upload/v123/dir/name_publicid.webp
      const lastSegment = url.split('/').pop();
      if (!lastSegment) return null;
      // remove extension
      const withoutExt =
        lastSegment.split('.').slice(0, -1).join('.') || lastSegment;
      // If folders exist, we lost them. Try to capture path after '/upload/'
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex !== -1) {
        const pathAfterUpload = url.substring(uploadIndex + 8); // after '/upload/'
        const parts = pathAfterUpload.split('/');
        // drop version segment starting with 'v'
        const filtered = parts.filter((p) => !/^v\d+/.test(p));
        const joined = filtered.join('/');
        const noExt = joined.split('.').slice(0, -1).join('.') || joined;
        return noExt;
      }
      return withoutExt;
    } catch (_) {
      return null;
    }
  };

  // Collect incoming replacements if any
  let indices = req.body?.['indices[]'] || req.body?.indices || [];
  // Normalize indices to array of numbers
  if (!Array.isArray(indices)) indices = [indices];
  indices = indices
    .map((i) => (typeof i === 'string' ? parseInt(i, 10) : i))
    .filter((i) => Number.isInteger(i) && i >= 0 && i < 3);

  // Multer stores files in req.files as an object with field names as keys
  const imageFiles = req.files?.['images[]'] || [];

  const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
  console.log('imageFiles:', imageFiles);
  console.log('filesArray:', filesArray);

  // If both arrays length mismatch, pair by min length
  const pairCount = Math.min(indices.length, filesArray.length);

  for (let k = 0; k < pairCount; k += 1) {
    console.log(`Processing pair ${k + 1}/${pairCount}`);
    const idx = indices[k];
    const fileObj = filesArray[k];
    if (typeof idx !== 'number' || !fileObj) continue;
    console.log(fileObj);

    const resizedBuffer = await sharp(fileObj.buffer)
      .resize(800, 950)
      .toFormat('webp')
      .toBuffer();

    // Upload new image to Cloudinary (multer stores in memory as buffer)
    const uploadResult = await uploadToCloudinary(resizedBuffer);
    console.log(uploadResult);

    // Attempt to delete old image if exists
    // const oldUrl = updatedImages[idx];
    // if (oldUrl) {
    //   const publicId = extractPublicId(oldUrl);
    //   if (publicId) {
    //     try {
    //       await cloudinary.uploader.destroy(publicId);
    //     } catch (e) {
    //       // non-fatal; continue
    //     }
    //   }
    // }

    // Replace with new secure URL
    updatedImages[idx] = uploadResult.secure_url;
  }

  // Build the final update payload
  // Start with the parsed body data
  const updatePayload = { ...bodyData };

  // Add images if we processed any
  if (pairCount > 0) {
    updatePayload.images = updatedImages;
  }

  // Set the complete update payload as req.body
  req.body = updatePayload;

  console.log('Final req.body being passed to updateOne:', req.body);

  next();
}; // RESIZE AND UPLOAD NEW ARTWORKS
exports.resizeANdUploadNewArtworks = async function (req, res, next) {
  // Body may be JSON (no image updates) or multipart (with optional images)
  console.log('reaizing and uploading');
  console.log(req.body);
  let bodyData = req.body || {};
  // console.log('req.body:', req.body);
  // console.log('req.files:', req.files);
  // console.log(req.is('multipart/form-data'));
  if (req.is('multipart/form-data') && bodyData.data) {
    try {
      bodyData = JSON.parse(bodyData.data);
    } catch (e) {
      return next(new AppError('Invalid JSON in form-data field "data"', 400));
    }
  }

  // Start from existing images
  const uploadedImages = [];

  // // Helper to extract cloudinary public_id from a secure_url

  // // Collect incoming replacements if any
  let indices = req.body?.['indices[]'] || req.body?.indices || [];
  // // Normalize indices to array of numbers
  if (!Array.isArray(indices)) indices = [indices];
  indices = indices
    .map((i) => (typeof i === 'string' ? parseInt(i, 10) : i))
    .filter((i) => Number.isInteger(i) && i >= 0 && i < 3);

  // // Multer stores files in req.files as an object with field names as keys
  const imageFiles = req.files?.['images[]'] || [];

  const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
  console.log('imageFiles:', imageFiles);
  console.log('filesArray:', filesArray);
  // If both arrays length mismatch, pair by min length
  const pairCount = Math.min(indices.length, filesArray.length);

  for (let k = 0; k < pairCount; k += 1) {
    console.log(`Processing pair ${k + 1}/${pairCount}`);
    const idx = indices[k];
    console.log(indices[k]);
    const fileObj = filesArray[k];
    console.log(fileObj);
    if (typeof idx !== 'number' || !fileObj) continue;

    const resizedBuffer = await sharp(fileObj.buffer)
      .resize(800, 950)
      .toFormat('webp')
      .toBuffer();

    // Upload new image to Cloudinary (multer stores in memory as buffer)
    const uploadResult = await uploadToCloudinary(resizedBuffer);

    // console.log('upllllooooooad result');

    console.log(uploadResult);
    // console.log('upllllooooooad result');
    // Replace with new secure URL
    uploadedImages[idx] = uploadResult.secure_url;
  }

  // // Build update payload

  if (pairCount > 0) {
    req.body = { ...bodyData, images: uploadedImages };
  }

  next();
};

// GET ALL API WITH FILTERING
exports.getAllArtworks = getAll(Artwork);
exports.getAllArtworksAdmin = catchAsync(async (req, res, next) => {
  // For admin - include deleted artworks
  let query = Artwork.includeDeleted();

  // Add custom sorting: non-deleted first, then deleted, then by other criteria
  if (!req.query.sort) {
    query = query.sort({ deleted: 1, createdAt: -1 }); // Non-deleted first, then by creation date
  }
  console.log(req.query.sort);
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const artworks = await features.query;

  res.status(200).json({
    status: 'success',
    results: artworks.length,
    data: { data: artworks },
  });
});
exports.restoreArtwork = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const artwork = await Artwork.includeDeleted().findByIdAndUpdate(
    req.params.id,
    {
      deleted: false,
      deletedAt: null,
    },
    { new: true, runValidators: true }
  );

  if (!artwork) {
    return next(new AppError('No artwork found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { data: artwork },
  });
});
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
