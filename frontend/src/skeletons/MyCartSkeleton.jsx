import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

const MyCartSkeleton = () => {
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

  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-12"
      >
        <SectionTitle title="Shopping Cart" />
        <motion.div
          variants={itemVariants}
          className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto mt-2 animate-pulse"
        ></motion.div>
      </motion.section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Cart Items Skeleton */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Cart Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg border border-beige overflow-hidden">
            <div className="p-6 border-b border-beige">
              <div className="h-7 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
            </div>

            {/* Cart Items Skeleton */}
            <div className="divide-y divide-beige">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-6 flex gap-4 animate-pulse">
                  {/* Image Skeleton */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 bg-gray-200 rounded-lg"></div>
                  </div>

                  {/* Item Details Skeleton */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded-lg w-32"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                      <div className="h-7 bg-gray-200 rounded-lg w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Code Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige">
            <div className="h-7 bg-gray-200 rounded-lg w-1/4 mb-4 animate-pulse"></div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary Skeleton */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-beige sticky top-4">
            <div className="p-6 border-b border-beige">
              <div className="h-7 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
            </div>

            <div className="p-6 space-y-4">
              {/* Summary Items Skeleton */}
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex justify-between animate-pulse">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                </div>
              ))}

              <hr className="border-beige" />

              {/* Total Skeleton */}
              <div className="flex justify-between animate-pulse">
                <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-1/5"></div>
              </div>

              {/* Checkout Button Skeleton */}
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse mt-6"></div>

              {/* Security Notice Skeleton */}
              <div className="flex items-center gap-2 mt-4 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded-lg w-32"></div>
              </div>
            </div>
          </div>

          {/* Continue Shopping Skeleton */}
          <div className="mt-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section Skeleton */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="text-center p-6 bg-white rounded-xl border border-beige animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-lg mx-auto mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-lg mx-auto w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCartSkeleton;
