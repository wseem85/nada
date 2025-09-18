import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

const MyProfileSkeleton = () => {
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
      {/* Header Section Skeleton */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-12"
      >
        <SectionTitle title="My Profile" />
        <motion.div
          variants={itemVariants}
          className="h-6 bg-beige-light rounded-lg max-w-2xl mx-auto mt-2 animate-pulse"
        ></motion.div>
      </motion.section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Profile Card Skeleton */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige sticky top-4">
            {/* Profile Image Skeleton */}
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto bg-beige-light rounded-full animate-pulse mb-4"></div>
              <div className="h-8 bg-beige-light rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 bg-beige-light rounded-lg animate-pulse w-1/2 mx-auto"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="h-6 bg-gray-300 rounded-lg mb-1"></div>
                <div className="h-4 bg-gray-300 rounded-lg w-3/4 mx-auto"></div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="h-6 bg-gray-300 rounded-lg mb-1"></div>
                <div className="h-4 bg-gray-300 rounded-lg w-3/4 mx-auto"></div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="h-12 bg-beige-light rounded-lg animate-pulse"></div>
          </div>
        </motion.div>

        {/* Profile Information Skeleton */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          {/* Personal Information Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
            <div className="h-7 bg-beige-light rounded-lg mb-6 w-1/3 animate-pulse"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index}>
                  <div className="h-4 bg-beige-light rounded-lg mb-2 w-3/4 animate-pulse"></div>
                  <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio Section Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
            <div className="h-7 bg-beige-light rounded-lg mb-6 w-1/4 animate-pulse"></div>
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          {/* Favorite Artists Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
            <div className="h-7 bg-beige-light rounded-lg mb-6 w-1/3 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-8 bg-beige-light rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity Section Skeleton */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12"
      >
        <div className="h-7 bg-beige-light rounded-lg mb-6 w-1/4 mx-auto animate-pulse"></div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 rounded-lg mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded-lg w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default MyProfileSkeleton;
