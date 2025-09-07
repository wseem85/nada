const express = require('express');
const artworksController = require('../controllers/artworksController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');
const router = express.Router({ mergeParams: true });
router.use('/:workId/reviews', reviewRouter);
router
  .route('/')
  .get(artworksController.getAllArtworks)
  .post(artworksController.createArtwork);
router.route('/stats').get(artworksController.getArtworksStata);
router
  .route('/:id')
  .get(artworksController.getArtwork)
  .patch(artworksController.updateArtwork)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    artworksController.deleteArtwork
  );
router.get('/:id/similars', artworksController.getSimilarArtworks);
module.exports = router;
