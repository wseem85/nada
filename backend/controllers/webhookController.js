const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Artwork = require('../models/artworkModel');
const mongoose = require('mongoose');

// Track processed sessions to avoid duplicate processing

exports.webhookCheckout = async (req, res, next) => {
  // Set a timeout for the entire webhook processing
  console.log('webhokk handler');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    console.log('💳 Processing checkout.session.completed event');
    const session = event.data.object;
    console.log(session.client_reference_id);
    console.log('🆔 Client reference ID:', session.client_reference_id);
    console.log('📊 Session metadata:', session.metadata);

    // Update order with timeout
    console.log('📝 Updating order...');

    const updatedOrder = await Order.findByIdAndUpdate(
      session.client_reference_id,
      { status: 'paid', paymentMethod: 'card' },
      { new: true }
    );

    if (!updatedOrder) {
      console.log('❌ Order not found:', session.client_reference_id);

      return res.status(404).json({
        error: 'Order not found',
        orderId: session.client_reference_id,
      });
    }
    console.log('✅ Order updated:', updatedOrder._id);

    // Update artworks with timeout
    console.log('🎨 Updating artworks...');
    const artworkIds = session.metadata.artworkIds.split(',');
    console.log('🎨 Artwork IDs:', artworkIds);

    const artworkUpdate = await Artwork.updateMany(
      { _id: { $in: artworkIds } },
      { available: false }
    );

    console.log(
      '🎨 Artworks updated:',
      artworkUpdate.modifiedCount,
      'artworks'
    );

    // Clear user cart with timeout
    console.log('🛒 Clearing user cart...');
    const userId = session.metadata.userId;
    console.log('👤 User ID:', userId);

    const userUpdate = await Promise.race([
      User.findByIdAndUpdate(userId, { cart: [] }, { new: true }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('User update timeout')), 5000)
      ),
    ]);

    if (!userUpdate) {
      console.log('❌ User not found:', userId);
    } else {
      console.log('✅ User cart cleared for user ID:', userId);
    }

    console.log('🎉 Webhook processing completed successfully');
  }

  // Clear timeout and send success response
};
