const express = require('express');
const {
  loginAdmin,
  logoutAdmin,

  getStoreStats,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../controllers/authController');
const authController = require('../controllers/authController');
// Public admin login
const router = express.Router({ mergeParams: true });
router.post('/login', loginAdmin);

// Example protected admin-only route scaffolds (add as needed)
// router.use(protect, restrictTo('admin'));
// router.get('/stats', adminController.getStats);

router.use(protect);
router.use(restrictTo('admin'));
router.get('/', authController.getMe);
router.get('/logout', logoutAdmin);
router.get('/store-stats', getStoreStats);

module.exports = router;
