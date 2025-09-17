import React, { useState } from 'react';

const ImageWithModal = ({ src, alt, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer ${className}`}
        onClick={openModal}
      />

      {isModalOpen && (
        <div className="fixed top-[60px] inset-0 bg-black bg-opacity-90 z-9999 flex justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-[12px] right-0 text-white text-3xl hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
            <img
              src={src}
              alt={alt}
              className="w-full max-h-screen object-contain"
            />
            {alt && (
              <div className="text-white text-center mt-2 text-sm bg-black bg-opacity-50 p-2 rounded">
                {alt}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageWithModal;
