import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="m-5 flex-1 px-4 max-w-2xl xl:max-w-3xl mx-auto divide-black animate-pulse">
      {/* Artworks Section Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-8 bg-beige-light rounded w-48 mx-auto mt-6"></div>
        <div className="grid grid-cols-2 gap-3 justify-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100"
            >
              <div className="space-y-6 w-full">
                <div className="flex gap-4 items-center justify-between">
                  <div className="w-12 h-12 bg-beige-light rounded"></div>
                  <div className="h-6 bg-beige-light rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-beige-light rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Section Skeleton */}
      <div className="flex flex-col gap-3 mt-8">
        <div className="h-8 bg-beige-light rounded w-40 mx-auto"></div>
        <div className="grid grid-cols-2 gap-3 justify-center ">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100"
            >
              <div className="space-y-6 w-full">
                <div className="flex gap-4 items-center justify-between">
                  <div className="w-8 h-8 bg-beige-light rounded"></div>
                  <div className="h-6 bg-beige-light rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-beige-light rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Section Skeleton */}
      <div className="flex flex-col gap-3 mt-8">
        <div className="h-8 bg-beige-light rounded w-40 mx-auto"></div>
        <div className="grid grid-cols-1 gap-3 justify-center lg:grid-cols-[1fr_5fr_5fr]">
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100">
            <div className="space-y-6 w-full">
              <div className="flex gap-8 items-center">
                <div
                  className="w-8 h-8 bg-beige-light
 rounded"
                ></div>
                <div
                  className="h-6 bg-beige-light

bg-beige-light rounded w-1/4"
                ></div>
              </div>
              <div
                className="h-4 bg-beige-light
 rounded w-2/3"
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 bg-white p-4 rounded border-2 border-gray-100">
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1 items-center">
                  <div className="flex gap-1 items-center">
                    <div className="w-8 h-8 bg-beige-light rounded-full"></div>
                    <div className="h-3 bg-beige-light rounded w-12"></div>
                  </div>
                  <div className="h-3 bg-beige-light rounded w-10"></div>
                </div>
              ))}
            </div>
            <div className="h-4 bg-beige-light rounded w-1/3 mt-2"></div>
          </div>
          <div className="flex flex-col items-start gap-2 bg-white p-4 rounded border-2 border-gray-100">
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1 items-center">
                  <div className="flex gap-1 items-center">
                    <div className="w-8 h-8 bg-beige-light rounded-full"></div>
                    <div className="h-3 bg-beige-light rounded w-12"></div>
                  </div>
                  <div className="h-3 bg-beige-light rounded w-16"></div>
                </div>
              ))}
            </div>
            <div className="h-4 bg-beige-light rounded w-1/2 mt-2"></div>
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="flex flex-col gap-3 mt-8">
        <div className="h-8 bg-beige-light rounded w-48 mx-auto"></div>
        <div className="grid grid-cols-2 gap-3 justify-center ">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100"
            >
              <div className="space-y-6 w-full">
                <div className="flex gap-4 items-center justify-between">
                  <div className="w-8 h-8 bg-beige-light rounded"></div>
                  <div className="h-6 bg-beige-light rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-beige-light rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
