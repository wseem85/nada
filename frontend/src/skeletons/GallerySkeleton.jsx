import React from 'react';

const GallerySkeleton = () => {
  return (
    <div className="space-y-6 mt-12 pt-16  gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full place-items-center">
      {/* Artwork Item Skeletons */}
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="w-full max-w-sm bg-white rounded-lg shadow-md "
        >
          <div className="w-full h-64 bg-beige rounded-t-lg animate-pulse"></div>
          <div className="p-4">
            <div className="w-3/4 h-5 bg-beige rounded animate-pulse mb-2"></div>
            <div className="w-1/2 h-4 bg-beige rounded animate-pulse"></div>
            <div className="w-1/3 h-4 bg-beige rounded animate-pulse mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
