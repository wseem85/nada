const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Order = require('../models/orderModel');

const catchAsync = require('../utils/catchAsync');

const Artwork = require('../models/artworkModel');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res) => {
  const { artworkIds } = req.body;

  console.log(artworkIds);
  const artworks = await Artwork.find({ _id: { $in: artworkIds } });
  const lineItems = artworks.map((artwork) => {
    // Calculate price (consider discounts)
    const unitAmount =
      artwork.discount > 0
        ? Math.round(
            (artwork.price - (artwork.price * artwork.discount) / 100) * 100
          )
        : Math.round(artwork.price * 100);

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: artwork.title,
          description: artwork.description.substring(0, 100) + '...', // Limit description length
          images: [artwork.images[0]], // First image
        },
        unit_amount: unitAmount,
      },
      quantity: 1,
    };
  });
  const tempOrder = await Order.create({
    artworks: artworkIds,
    user: req.user.id,
    totalPrice: artworks.reduce((sum, artwork) => {
      return (
        sum +
        (artwork.discount > 0
          ? artwork.price - (artwork.price * artwork.discount) / 100
          : artwork.price)
      );
    }, 0), // Capture price at this moment

    status: 'pending',
    paymentMethod: 'card',
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Accepts credit/debit cards
    success_url: `${req.protocol}://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://localhost:5173/`,
    customer_email: req.user.email, // Pre-fills email in Stripe Checkout
    client_reference_id: tempOrder._id.toString(), // we place this in this custom field because we nned it later to do the booking on databasr
    metadata: {
      artworkIds: artworkIds.join(','), // Store artwork IDs as metadata
      userId: req.user._id.toString(),
    },
    line_items: lineItems,
    mode: 'payment', // One-time payment (use 'subscription' for recurring
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

// orderController.js

exports.handleSuccessfulPayment = catchAsync(async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({
      status: 'fail',
      message: 'Session ID is required',
    });
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify the payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        status: 'fail',
        message: 'Payment not completed',
      });
    }

    // Find the order using client_reference_id (which is the order ID)
    const order = await Order.findById(session.client_reference_id)
      .populate('artworks')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    // Verify the order belongs to the authenticated user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized to view this order',
      });
    }

    // Prepare the response data
    const responseData = {
      order: {
        id: order._id,
        status: order.status,
        createdAt: order.createdAt,
        totalPrice: order.totalPrice,
      },
      paymentDetails: {
        amountTotal: session.amount_total / 100, // Convert from cents to dollars
        customerEmail: session.customer_email,
        paymentStatus: session.payment_status,
      },
      artworks: order.artworks.map((artwork) => ({
        id: artwork._id,
        title: artwork.title,
        images: artwork.images,
        price: artwork.price,
        discount: artwork.discount,
        finalPrice:
          artwork.discount > 0
            ? artwork.price - (artwork.price * artwork.discount) / 100
            : artwork.price,
        dimensions: {
          width: artwork.width,
          height: artwork.height,
        },
      })),
    };

    res.status(200).json({
      status: 'success',
      data: responseData,
    });
  } catch (error) {
    console.error('Error retrieving payment session:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve payment information',
    });
  }
});
