const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const router = express.Router({ mergeParams: true });
router.use(protect);
router.use(restrictTo('admin'));
router.get('/', getAllOrders);
router.route('/:id').patch(updateOrder).delete(deleteOrder);
module.exports = router;
