import React from 'react';
import { motion } from 'framer-motion';

const NewArtworkSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-b-zinc-300 pb-3">
      {/* Image skeleton */}
      <div className="md:min-w-[300px] relative">
        <div className="md:min-w-full h-[200px] md:h-[250px] bg-beige-light animate-pulse rounded-lg"></div>

        {/* Button skeletons */}
        <div className="absolute p-2 top-5 left-1.5 w-10 h-10 rounded-full bg-beige animate-pulse"></div>
        <div className="absolute p-2 top-20 left-1.5 w-10 h-10 rounded-full bg-beige animate-pulse"></div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 space-y-4">
        <div className="space-y-2 grid grid-cols-[1fr_1fr] md:flex md:flex-col gap-2">
          {/* Title skeleton */}
          <div className="h-6 bg-beige-light animate-pulse rounded w-3/4"></div>

          {/* Date skeleton */}
          <div className="h-4 bg-beige-light animate-pulse rounded w-1/2"></div>

          {/* Availability skeleton */}
          <div className="h-5 bg-beige-light animate-pulse rounded w-1/3"></div>

          {/* Price skeleton */}
          <div className="h-5 bg-beige-light animate-pulse rounded w-1/4"></div>
        </div>

        {/* Description skeletons */}
        <div className="space-y-2">
          <div className="h-4 bg-beige-light animate-pulse rounded w-full"></div>
          <div className="h-4 bg-beige-light animate-pulse rounded w-5/6"></div>
          <div className="h-4 bg-beige-light animate-pulse rounded w-4/5"></div>
          <div className="h-4 bg-beige-light animate-pulse rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default NewArtworkSkeleton;
