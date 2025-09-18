const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Artwork = require('../models/artworkModel');
const mongoose = require('mongoose');

exports.webhookCheckout = async (req, res, next) => {
  console.log('🔔 Webhook handler called');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Event verified:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      console.log('💳 Processing checkout.session.completed event');
      const session = event.data.object;

      console.log('🆔 Client reference ID:', session.client_reference_id);
      console.log('📊 Session metadata:', session.metadata);

      if (!session.client_reference_id) {
        console.log('❌ No client reference ID found in session');
        return res.status(400).json({ error: 'No order ID found' });
      }

      // Update order
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

      // Update artworks
      if (session.metadata && session.metadata.artworkIds) {
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
      }

      // Clear user cart
      if (session.metadata && session.metadata.userId) {
        console.log('🛒 Clearing user cart...');
        const userId = session.metadata.userId;
        console.log('👤 User ID:', userId);

        const userUpdate = await User.findByIdAndUpdate(
          userId,
          { cart: [] },
          { new: true }
        );

        if (!userUpdate) {
          console.log('❌ User not found:', userId);
        } else {
          console.log('✅ User cart cleared for user ID:', userId);
        }
      }

      console.log('🎉 Webhook processing completed successfully');
    } else {
      console.log('🔄 Received event type:', event.type);
    }

    // IMPORTANT: Always send a response to Stripe
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
