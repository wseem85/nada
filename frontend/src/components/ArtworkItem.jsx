import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ArtworkItem = ({ artworkItem }) => {
  const { images, title, price, available, discount, avgRating } = artworkItem;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <NavLink to={`/gallery/${artworkItem._id}`} onClick={() => scrollTo(0, 0)}>
      <div className="w-full rounded-lg bg-white flex flex-col gap-2 h-[480px]">
        <div className="relative w-full h-[380px] bg-beige-light rounded-t-lg overflow-hidden">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-beige animate-pulse rounded-t-lg"></div>
          )}

          {/* Stock status badge */}
          <span className="absolute top-2 left-2 z-10 px-2 py-1 text-xs font-medium bg-white rounded shadow-sm">
            {available ? 'In Stock' : 'Sold out'}
          </span>

          {/* Image with fixed dimensions */}
          <img
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            src={images[0]}
            alt={`Artwork: ${title}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Content section with fixed height */}
        <div className="flex flex-col gap-2 p-2 h-[80px]">
          {/* Title and rating row */}
          <div className="flex items-start justify-between gap-2 h-6">
            <p className="font-caveat font-medium text-lg tracking-normal truncate flex-1">
              {title}
            </p>
            <div className="flex gap-1 items-center flex-shrink-0">
              <FaStar className="text-text text-lg" />
              <span className="text-sm">{avgRating}</span>
            </div>
          </div>

          {/* Price section with fixed height */}
          <div className="h-6 flex items-center">
            {!discount ? (
              <p className="relative text-lg tracking-wider">
                ${price}
                <span className="absolute tracking-tighter text-xs pl-1 top-0">
                  USC
                </span>
              </p>
            ) : (
              <p className="relative text-lg tracking-wider">
                <span className="line-through pr-4 opacity-50">${price}</span>
                <span>${(price - (price * discount) / 100).toFixed(2)}</span>
                <span className="absolute tracking-tighter text-xs pl-1 top-0">
                  USC
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ArtworkItem;
