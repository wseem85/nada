const express = require('express');
const artworksController = require('../controllers/artworksController');
const authController = require('../controllers/authController');
const { protect, restrictTo } = authController;
const { setWorkAndUserIds } = require('../controllers/reviewController');
const reviewController = require('../controllers/reviewController');
const multer = require('multer');

// Configure multer for artwork image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

const router = express.Router({ mergeParams: true });
router
  .route('/:workId/reviews')
  .get(reviewController.getArtworkReviews)
  .post(
    protect,
    restrictTo('admin', 'user'),
    setWorkAndUserIds,
    reviewController.createReview
  );
router.route('/admin/artworks').get(artworksController.getAllArtworksAdmin);
router
  .route('/')
  .get(artworksController.getAllArtworks)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    upload.fields([
      { name: 'images[]', maxCount: 3 },
      { name: 'indices[]', maxCount: 3 },
    ]),
    artworksController.resizeANdUploadNewArtworks,
    artworksController.createArtwork
  );
router
  .route('/stats')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    artworksController.getArtworksStata
  );
router.route('/:id/restore').patch(artworksController.restoreArtwork);
router
  .route('/:id')
  .get(artworksController.getArtwork)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    upload.fields([
      { name: 'images[]', maxCount: 3 },
      { name: 'indices[]', maxCount: 3 },
    ]),
    artworksController.resizeANdUploadEditedArtworks,
    artworksController.updateArtwork
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    upload.fields([
      { name: 'images[]', maxCount: 3 },
      { name: 'indices[]', maxCount: 3 },
    ]),
    artworksController.resizeANdUploadNewArtworks,
    artworksController.createArtwork
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    artworksController.deleteArtwork
  );
router.get('/:id/similars', artworksController.getSimilarArtworks);
module.exports = router;
