import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { loadStripe } from '@stripe/stripe-js';
import SectionTitle from '../components/SectionTitle';
import { artworks } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiHeart,
  FiTag,
  FiTruck,
  FiShield,
  FiCreditCard,
} from 'react-icons/fi';
import { AppContext, CartContext } from '../contexts/contexts';
import axios from 'axios';
import { getErrorMessage } from '../../utils/errorHandler';
import MyCartSkeleton from '../skeletons/MyCartSkeleton';

const MyCart = () => {
  const { cart, errorGetCart, isLoadingCart, updateCartData, removeFromCart } =
    useContext(CartContext);
  // Mock cart data - in a real app, this would come from context or API
  const { backendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Calculate totals
  const calculateItemTotal = (item) => {
    const basePrice = item.artwork.price;
    const discountedPrice =
      item.artwork.discount > 0
        ? basePrice - (basePrice * item.artwork.discount) / 100
        : basePrice;
    return discountedPrice;
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );
  const promoDiscount = appliedPromo
    ? (subtotal * appliedPromo.discount) / 100
    : 0;
  const shipping = subtotal > 2000 ? 0 : 150; // Free shipping over $2000
  const tax = (subtotal - promoDiscount) * 0.08; // 8% tax
  const total = subtotal - promoDiscount + shipping + tax;

  // Cart actions

  const applyPromoCode = () => {
    const validPromoCodes = {
      FIRST10: { discount: 10, description: 'First time buyer discount' },
      ARTLOVER20: { discount: 20, description: 'Art lover special' },
      SAVE15: { discount: 15, description: 'Save 15% discount' },
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        ...validPromoCodes[promoCode.toUpperCase()],
      });
      toast.success('Promo code applied successfully!');
      setPromoCode('');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast.success('Promo code removed');
  };
  console.log(cart);
  const handleCheckout = async () => {
    try {
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );
      const artworkIds = cart.map((item) => item.artwork._id);

      const session = await axios.post(
        backendUrl + `/api/users/checkout-session`,
        { artworkIds }
      );
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };
  if (isLoadingCart) return <MyCartSkeleton />;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-beige-light rounded-full flex items-center justify-center">
            <FiShoppingBag className="w-12 h-12 text-beige-dark" />
          </div>
          <p className="text-3xl  mb-4">Your Cart is Empty</p>
          <p className="text-gray-600 mb-8">
            Discover beautiful artworks and add them to your cart to get
            started.
          </p>
          <NavLink
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Browse Gallery
            <FiArrowRight className="w-4 h-4" />
          </NavLink>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-12"
      >
        <SectionTitle title="Shopping Cart" />
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Review your selected artworks and proceed to checkout
        </motion.p>
      </motion.section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Cart Items */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-beige overflow-hidden">
            <div className="p-6 border-b border-beige">
              <p className="text-xl  font-medium">Cart Items ({cart.length})</p>
            </div>

            <div className="divide-y divide-beige">
              <AnimatePresence>
                {cart.map((item) => {
                  console.log(item);
                  const discountedPrice =
                    item.artwork.discount > 0
                      ? item.artwork.price -
                        (item.artwork.price * item.artwork.discount) / 100
                      : item.artwork.price;

                  return (
                    <motion.div
                      key={item.artwork.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-6 flex gap-4"
                    >
                      {/* Artwork Image */}
                      <div className="flex-shrink-0">
                        <NavLink to={`/gallery/${item.artwork._id}`}>
                          <img
                            src={item.artwork.images[0]}
                            alt={item.artwork.title}
                            className="w-24 h-32 object-cover rounded-lg border border-beige hover:opacity-75 transition-opacity"
                          />
                        </NavLink>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <NavLink
                              to={`/gallery/${item.artwork._id}`}
                              className="text-lg font-medium text-text hover:text-brand transition-colors"
                            >
                              {item.artwork.title}
                            </NavLink>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600">
                                {item.artwork.width}" × {item.artwork.height}"
                              </span>
                              <span className="text-sm text-gray-400">•</span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.artwork._id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove from cart"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          {/* <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Qty:</span>
                            <div className="flex items-center border border-beige rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-2 hover:bg-beige-light transition-colors"
                              >
                                <FiMinus className="w-3 h-3" />
                              </button>
                              <span className="px-4 py-2 text-center min-w-12">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 hover:bg-beige-light transition-colors"
                              >
                                <FiPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div> */}

                          {/* Price */}
                          <div className="text-right">
                            {item.artwork.discount > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                ${item.artwork.price.toFixed(2)}
                              </p>
                            )}
                            <p className="text-lg font-semibold text-text">
                              ${calculateItemTotal(item).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Discount Badge */}
                        {item.artwork.discount > 0 && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                              <FiTag className="w-3 h-3" />
                              {item.artwork.discount}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige">
            <p className="text-lg font-medium text-text mb-4">Promo Code</p>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiTag className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700">
                    {appliedPromo.code}
                  </span>
                  <span className="text-sm text-green-600">
                    (-{appliedPromo.discount}%)
                  </span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                />
                <button
                  onClick={applyPromoCode}
                  disabled={!promoCode.trim()}
                  className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-beige sticky top-4">
            <div className="p-6 border-b border-beige">
              <p className="text-xlfont-medium">Order Summary</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {/* Promo Discount */}
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount ({appliedPromo.code})</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Shipping */}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span
                  className={`font-medium ${
                    shipping === 0 ? 'text-green-600' : ''
                  }`}
                >
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {/* Tax */}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              <hr className="border-beige" />

              {/* Total */}
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-brand-dark">${total.toFixed(2)}</span>
              </div>

              {/* Free Shipping Notice */}
              {shipping > 0 && (
                <p className="text-sm text-gray-600 bg-beige-light p-3 rounded-lg">
                  <FiTruck className="inline w-4 h-4 mr-1" />
                  Free shipping on orders over $2,000
                </p>
              )}

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </>
                )}
              </motion.button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
                <FiShield className="w-4 h-4" />
                <span>Secure checkout guaranteed</span>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <NavLink
              to="/gallery"
              className="w-full border-2 border-brand text-brand hover:bg-brand hover:text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Continue Shopping
              <FiArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 grid md:grid-cols-3 gap-6"
      >
        <div className="text-center p-6 bg-white rounded-xl border border-beige">
          <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTruck className="w-6 h-6 text-white" />
          </div>
          <p className="font-medium text-text mb-2">Free Shipping</p>
          <p className="text-sm text-gray-600">
            Free shipping on orders over $2,000
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl border border-beige">
          <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-6 h-6 text-white" />
          </div>
          <p className="font-medium text-text mb-2">Secure Payment</p>
          <p className="text-sm text-gray-600">
            Your payment information is secure
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl border border-beige">
          <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHeart className="w-6 h-6 text-white" />
          </div>
          <p className="font-medium text-text mb-2">Satisfaction Guarantee</p>
          <p className="text-sm text-gray-600">30-day return policy</p>
        </div>
      </motion.section>
    </div>
  );
};

export default MyCart;
