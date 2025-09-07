import React from 'react';

const WorkDesktopSkeleton = () => {
  // Mock data for the skeleton
  const mockImages = [1, 2, 3, 4]; // Adjust based on expected number of thumbnails

  return (
    <div className="max-w-6xl mx-auto p-6 hidden md:block">
      <div className="hidden md:block">
        <div className="grid grid-cols-[1fr_8fr_5fr] gap-6">
          {/* Left Column - Thumbnails Skeleton */}
          <div className="flex flex-col space-y-4 max-h-[500px] overflow-y-hidden pr-2">
            {mockImages.map((_, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg border-2 border-gray-200 p-1"
              >
                <div className="w-full h-16 bg-beige rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Middle Column - Main Image & Description Skeleton */}
          <div className="rounded-lg p-4">
            {/* Main Image Skeleton */}
            <div className="w-full h-96 bg-beige rounded-lg animate-pulse"></div>

            {/* Description Skeleton */}
            <div className="mt-8 text-sm space-y-2">
              <div className="h-4 w-full bg-beige rounded animate-pulse"></div>
              <div className="h-4 w-full bg-beige rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-beige rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-beige rounded animate-pulse"></div>
            </div>
          </div>

          {/* Right Column - Details Skeleton */}
          <div className="mt-8 md:block">
            {/* Title Skeleton */}
            <div className="h-8 w-3/4 bg-beige rounded mx-auto animate-pulse mb-6"></div>

            {/* Availability & Price Skeleton */}
            <div className="mt-4 flex justify-between">
              <div className="h-5 w-20 bg-beige rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-beige rounded animate-pulse"></div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="text-center mt-6">
              <div className="h-12 w-full bg-beige rounded-sm animate-pulse"></div>
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
            <div className="flex-col gap-3 mt-5 bg-gray-100 p-4 hidden md:flex">
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
          </div>
        </div>
      </div>

      {/* Image Counter Skeleton (hidden on desktop but structure preserved) */}
      <div className="text-center mt-4 text-gray-600 md:hidden">
        <div className="h-4 w-12 bg-beige rounded mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default WorkDesktopSkeleton;
