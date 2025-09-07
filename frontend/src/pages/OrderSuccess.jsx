// src/pages/OrderSuccess.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiMail, FiArrowRight } from 'react-icons/fi';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    const processPayment = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/users/order-success?session_id=${sessionId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (data.status === 'success') {
          setOrderData(data.data);
        } else {
          setError(data.message || 'Payment processing failed');
        }
      } catch (err) {
        console.error('Error processing payment:', err);
        setError('Failed to process payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-caveat text-text mb-2">
            Processing your payment...
          </h2>
          <p className="text-text opacity-70">
            Please wait while we confirm your order.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-caveat text-text mb-4">
            Something went wrong
          </h2>
          <p className="text-text opacity-70 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/cart')}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl text-green-500 mb-4">
            <FiCheckCircle className="mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-caveat text-text mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-text opacity-70">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xl  text-text mb-4">Order Details</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text opacity-70">Order ID:</span>
                  <span className="text-text font-medium">
                    {orderData.order.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text opacity-70">Status:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {orderData.order.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text opacity-70">Payment Method:</span>
                  <span className="text-text font-medium">Credit Card</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xl  text-text mb-4">Payment Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text opacity-70">Amount Paid:</span>
                  <span className="text-brand font-bold text-lg">
                    {formatPrice(orderData.paymentDetails.amountTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text opacity-70">Email:</span>
                  <span className="text-text font-medium text-sm">
                    {orderData.paymentDetails.customerEmail}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Purchased Artworks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <p className="text-2xl  text-text mb-6">Your Artworks</p>
          <div className="grid md:grid-cols-2 gap-6">
            {orderData.artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="flex gap-4 p-4 bg-beige-light rounded-lg"
              >
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={artwork.images[0]}
                    alt={artwork.title}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder-artwork.jpg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text mb-1">{artwork.title}</p>
                  <div className="flex items-center gap-2">
                    {artwork.discount > 0 ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(artwork.price)}
                        </span>
                        <span className="text-brand font-medium">
                          {formatPrice(artwork.finalPrice)}
                        </span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                          {artwork.discount}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-brand font-medium">
                        {formatPrice(artwork.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h3 className="text-2xl  text-text mb-4">What's Next?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <FiMail className="text-3xl text-brand mx-auto mb-2" />
              <p className="font-medium text-text mb-1">Confirmation Email</p>
              <p className="text-sm text-text opacity-70">
                You'll receive a confirmation email shortly
              </p>
            </div>
            <div className="text-center p-4">
              <FiPackage className="text-3xl text-brand mx-auto mb-2" />
              <p className="font-medium text-text mb-1">Preparation</p>
              <p className="text-sm text-text opacity-70">
                Your artworks will be prepared for delivery
              </p>
            </div>
            <div className="text-center p-4">
              <FiArrowRight className="text-3xl text-brand mx-auto mb-2" />
              <p className="font-medium text-text mb-1">Tracking</p>
              <p className="text-sm text-text opacity-70">
                We'll notify you when your order ships
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/my-profile')}
            className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <FiPackage />
            View My Orders
          </button>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-3 border-2 border-brand text-brand hover:bg-brand hover:text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-beige-dark hover:bg-opacity-90 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
