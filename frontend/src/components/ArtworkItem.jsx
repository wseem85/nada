import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
const ArtworkItem = ({ artworkItem }) => {
  const { images, title, price, available, discount, avgRating } = artworkItem;
  return (
    <NavLink to={`/gallery/${artworkItem._id}`} onClick={() => scrollTo(0, 0)}>
      <div className="flex flex-col gap-3 justify-center mx-auto mb-12 sm:ml-8 w-[320px] h-[430px]">
        <div
          className={`min-w-full h-full relative bg-cover bg-no-repeat `}
          style={{ backgroundImage: `url(${images[0]})` }}
        >
          <span className="absolute pr-2 pl-0.5 h-8 bg-white ">
            {available ? 'In Stock' : 'Sold out'}
          </span>
          {/* <img
            // className="relative "
            className="rounded h-full "
            src={images[0]}
            alt=""
          /> */}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex  items-center gap-8">
            <p className=" font-caveat font-medium text-xl tracking-normal">
              {title}
            </p>
            <div className="flex gap-2 items-center">
              <FaStar className="text-text text-xl" /> <span> {avgRating}</span>
            </div>
          </div>
          {!discount ? (
            <p className="relative text-lg tracking-wider">
              ${price}{' '}
              <span className="absolute tracking-tighter text-xs pl-1 top-0">
                USC
              </span>{' '}
            </p>
          ) : (
            <p className="relative text-lg tracking-wider">
              <span className=" line-through pr-4 opacity-50">${price}</span>{' '}
              <span> ${(price - (price * discount) / 100).toFixed(2)} </span>
              <span className="absolute tracking-tighter text-xs pl-1 top-0">
                USC
              </span>{' '}
            </p>
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default ArtworkItem;
