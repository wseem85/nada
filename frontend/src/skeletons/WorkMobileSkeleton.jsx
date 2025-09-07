import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WorkMobileSkeleton = () => {
  // Mock data for the skeleton - same number of images as expected
  const mockImages = [1, 2, 3]; // Adjust based on expected image count
  const mockImagePositions = mockImages.map((_, index) => ({
    index,
    position: index,
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 md:hidden">
      {/* Gallery Container Skeleton */}
      <div className="relative h-96 overflow-hidden rounded-xl bg-beige-light shadow-lg animate-pulse">
        <div className="flex items-center justify-center h-full">
          <AnimatePresence initial={false}>
            {mockImagePositions.map(({ index, position }) => (
              <motion.div
                key={index}
                className={`absolute h-5/6 w-5/6 flex items-center justify-center ${
                  position === 0 ? 'z-10' : 'z-0'
                }`}
                initial={{
                  x: `${position * 90}%`,
                  scale: position === 0 ? 1 : 0.85,
                  opacity: position === 0 ? 1 : 0.7,
                }}
                animate={{
                  x: `${position * 45}%`,
                  scale: position === 0 ? 1 : 0.85,
                  opacity: position === 0 ? 1 : 0.7,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="w-full h-full bg-beige rounded-lg shadow-md animate-pulse"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Circle Indicators Skeleton */}
      <div className="flex justify-center mt-8 space-x-3">
        {mockImages.map((_, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full bg-beige animate-pulse"
          />
        ))}
      </div>

      {/* Image Counter Skeleton */}
      <div className="text-center mt-4">
        <div className="h-4 w-12 bg-beige rounded mx-auto animate-pulse"></div>
      </div>

      <div className="mt-8 md:hidden">
        {/* Title Skeleton */}
        <div className="h-8 w-3/4 bg-beige rounded mx-auto animate-pulse mb-4"></div>

        {/* Availability & Price Skeleton */}
        <div className="mt-4 flex justify-between">
          <div className="h-5 w-20 bg-beige rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-beige rounded animate-pulse"></div>
        </div>

        {/* Add to Cart Button Skeleton */}
        <div className="text-center mt-6">
          <div className="h-12 w-full bg-beige rounded-sm animate-pulse mx-auto"></div>
        </div>

        {/* Dimensions & Categories Skeleton */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="h-5 w-24 bg-beige rounded animate-pulse"></div>
          <div className="h-5 w-32 bg-beige rounded animate-pulse"></div>
        </div>

        {/* Rating & Rate Button Skeleton */}
        <div className="mt-4 flex gap-2 justify-between">
          <div className="h-6 w-20 bg-beige rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-beige rounded animate-pulse"></div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="flex flex-col gap-3 mt-5 bg-gray-100 p-4 md:hidden">
          <div className="h-6 w-32 bg-beige rounded animate-pulse mb-3"></div>

          {/* Top Review Skeleton */}
          <div className="flex flex-col gap-3 border-b border-gray-200 mb-4 pb-3">
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 bg-beige rounded-full animate-pulse"></div>
              <div className="h-5 w-24 bg-beige rounded animate-pulse"></div>
              <div className="h-5 w-8 bg-beige rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-full bg-beige rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-beige rounded animate-pulse"></div>
          </div>

          {/* Show All Reviews Button Skeleton */}
          <div className="h-5 w-32 bg-beige rounded animate-pulse"></div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-beige rounded animate-pulse"></div>
          <div className="h-4 w-full bg-beige rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-beige rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default WorkMobileSkeleton;
