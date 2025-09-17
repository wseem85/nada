import React from 'react';
import ImageWithModal from './ImageWithModal';

const ArtworkLine = ({ artwork, onEdit, onDelete, onRestore }) => {
  return (
    <div
      className={`pb-12 px-4 border-b border-gray-400 pt-5 ${
        artwork.deleted ? 'bg-red-100 opacity-95' : ''
      }`}
    >
      <div className="flex flex-col items-start lg:grid lg:grid-cols-[1fr_2fr] gap-4 ">
        <div className="">
          <div className="flex gap-3">
            <p className="text-lg font-medium uppercase tracking-wider">
              {artwork.title}
            </p>

            {!artwork.deleted ? (
              <div className="flex gap-2">
                <span
                  className={`text-xs font-medium italic ${
                    artwork.available ? 'text-green-600' : 'text-red-400'
                  }`}
                >
                  {artwork.available ? 'In Store' : 'Sold out'}
                </span>
                {artwork.discount ? (
                  <span className="text-green text-xs italic text-green-600 font-medium">
                    {artwork.discount}% off
                  </span>
                ) : (
                  <span className="text-green text-xs italic text-gray-400 font-medium">
                    0% off
                  </span>
                )}
              </div>
            ) : (
              <span className="text-red-500 text-xs italic text-bold font-medium">
                Deleted!
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {artwork.categories.map((category, i, catogories) => {
              if (i === catogories.length - 1) {
                return <p key={i}> {category}.</p>;
              } else {
                return <p key={i}> {category}, </p>;
              }
            })}
          </div>
          <div className="flex gap-4">
            <p>
              {artwork.width}&Prime; X {artwork.height}&Prime;
            </p>
            <p>
              {artwork.discount ? (
                <div className="flex gap-2">
                  <span>
                    $
                    {(
                      artwork.price -
                      (artwork.price * artwork.discount) / 100
                    ).toFixed(2)}
                  </span>
                  <span className="line-through opacity-50">
                    ${artwork.price}
                  </span>
                </div>
              ) : (
                <span>${artwork.price}</span>
              )}
            </p>
          </div>
          <div className="flex space-between gap-3 mt-4 mb-3">
            {!artwork.deleted ? (
              <button
                onClick={onEdit}
                className="px-3 text-sm py-1 border rounded-lg  border-gray-500 hover:border-gray-600 transition-all duration-150"
              >
                Edit
              </button>
            ) : null}
            {!artwork.deleted ? (
              <button
                onClick={onDelete}
                className="px-3 text-sm py-1 border rounded-lg text-red-400  border-red-500 hover:border-red-700 hover:text-red-500 transition-all duration-150"
              >
                Delete
              </button>
            ) : (
              <button
                onClick={onRestore}
                className="px-3 text-sm py-1 border rounded-lg text-blue-600 border-blue-600 hover:border-blue-700 transition-all duration-150"
              >
                Restore
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-4 ">
          {artwork.images.map((image, i) => (
            <div className="max-w-[25%]" key={i}>
              {/* <img className="min-w-full" src={image} /> */}
              <ImageWithModal
                src={image}
                alt={`${artwork.title} - Image ${i + 1}`}
                className={`cursor-pointer min-w-full`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-shadow-zinc-400 max-w-[80%] xl:mt-8">
        {artwork.description}
      </div>
    </div>
  );
};

export default ArtworkLine;
