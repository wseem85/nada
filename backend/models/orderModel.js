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
  totalPrice: {
    type: Number,
    required: [true, 'Order must have a total price'],
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'pending', 'delivered', 'cancelled', 'fullfilled'],
    default: 'unpaid',
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
