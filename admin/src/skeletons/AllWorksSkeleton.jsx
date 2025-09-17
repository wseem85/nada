import React from 'react';

const AllWorksSkeleton = () => {
  return (
    <div className="min-w-full px-4">
      <div className="flex flex-col  items-start gap-2 mt-8 mb-6 w-full">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="pb-12 border-b border-gray-200 pt-5 animate-pulse"
          >
            <div className="flex flex-col items-start lg:grid lg:grid-cols-[1fr_2fr] gap-4">
              {/* Left side - artwork details */}
              <div className="w-full">
                {/* Title and status row */}
                <div className="flex gap-3 mb-4">
                  <div className="h-6 bg-white rounded w-1/3"></div>
                  <div className="h-5 bg-white rounded w-16"></div>
                  <div className="h-5 bg-white rounded w-12"></div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-4">
                  <div className="h-4 bg-white rounded w-20"></div>
                  <div className="h-4 bg-white rounded w-16"></div>
                  <div className="h-4 bg-white rounded w-24"></div>
                </div>

                {/* Dimensions and price */}
                <div className="flex gap-4 mb-6">
                  <div className="h-4 bg-white rounded w-20"></div>
                  <div className="h-4 bg-white rounded w-16"></div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-4 mb-3">
                  <div className="h-8 bg-white rounded w-16"></div>
                  <div className="h-8 bg-white rounded w-16"></div>
                </div>
              </div>

              {/* Right side - images */}
              <div className="flex gap-4 w-full">
                {[...Array(3)].map((_, i) => (
                  <div className=" w-full" key={i}>
                    <div className="min-w-full h-60 w-40 lg:w-56 bg-white rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 xl:mt-8 space-y-2">
              <div className="h-4 bg-white rounded w-full"></div>
              <div className="h-4 bg-white rounded w-4/5"></div>
              <div className="h-4 bg-white rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllWorksSkeleton;
