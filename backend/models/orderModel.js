const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user'],
  },
  artworks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Artwork',
      required: [true, 'Order must have at least one artwork'],
    },
  ],
  taxAmount: { type: Number },
  shippingAmount: { type: Number },
  totalPrice: {
    type: Number,
    required: [true, 'Order must have a total price'],
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'delivered'],
    default: 'pending',
  },
  paymentMethod: String,
  paidAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// populating user and tour
// orderSchema.pre(/^find/, function (next) {
//   this.populate('user').populate({
//     path: 'artwork',
//     select: 'title',
//   });
// });
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
