import React, { useContext, useEffect, useState } from 'react';
import { IoBagAdd, IoBagRemove } from 'react-icons/io5';
import { RiSendPlaneFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext, CartContext } from '../contexts/contexts';

const NewArtwork = ({ artwork }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const [inCart, setInCart] = useState(
    cart.find((el) => el.artwork?._id === artwork?._id)
  );
  const [imageAspect, setImageAspect] = useState('landscape'); // default to landscape
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length !== 0) {
      const inCart = cart.some((el) => el.artwork?._id === artwork._id);
      if (inCart) setInCart(true);
      else setInCart(false);
    }
  }, [cart, artwork._id]);

  // Determine if image is portrait or landscape
  useEffect(() => {
    if (artwork.images && artwork.images[0]) {
      const img = new Image();
      img.src = artwork.images[0];
      img.onload = () => {
        console.log(img.width, img.height);
        setImageAspect(img.width > img.height ? 'landscape' : 'portrait');
      };
    }
  }, [artwork.images]);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-b-zinc-300 pb-3">
      <div
        className={`relative flex-1 ${
          imageAspect === 'portrait' ? 'max-w-[300px]' : 'w-full'
        }`}
      >
        <div
          className={`overflow-hidden rounded-lg ${
            imageAspect === 'portrait' ? 'h-[400px]' : 'h-[300px]'
          }`}
        >
          <img
            className={`w-full h-full object-cover ${
              imageAspect === 'portrait' ? 'object-top' : 'object-center'
            }`}
            src={artwork.images[0]}
            alt={artwork.title}
          />
        </div>
        {!inCart ? (
          <motion.button
            onClick={async () => {
              addToCart(artwork._id);
            }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0px rgba(255,255,255,0.3)',
                '0 0 0 4px rgba(255,255,255,0.1)',
                '0 0 0 0px rgba(255,255,255,0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute p-2 top-5 left-1.5 w-10 h-10 rounded-full bg-white/20 text-white flex justify-center items-center"
          >
            <IoBagAdd className="text-2xl text-text" />
          </motion.button>
        ) : (
          <motion.button
            onClick={() => removeFromCart(artwork._id)}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0px rgba(255,255,255,0.3)',
                '0 0 0 4px rgba(255,255,255,0.1)',
                '0 0 0 0px rgba(255,255,255,0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute p-2 top-5 left-1.5 w-10 h-10 rounded-full bg-white/20 text-white flex justify-center items-center"
          >
            <IoBagRemove className="text-2xl text-text" />
          </motion.button>
        )}
        <motion.button
          onClick={() => navigate(`/gallery/${artwork._id}`)}
          className="absolute p-2 top-20 left-1.5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex justify-center items-center shadow-lg"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 0 0px rgba(255,255,255,0.3)',
              '0 0 0 4px rgba(255,255,255,0.1)',
              '0 0 0 0px rgba(255,255,255,0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <RiSendPlaneFill className="text-2xl text-text" />
        </motion.button>
      </div>
      <div className="flex-1">
        <div className="space-y-2 grid grid-cols-[1fr_1fr] md:flex md:flex-col ">
          <p className="text-base font-semibold">{artwork.title}</p>
          <p className="text-sm ">
            {new Date(artwork.createdAt)
              .toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              .replace(/\s/g, ',')}
          </p>
          <p
            className={`text-lg font-medium ${
              artwork.available ? 'text-green-600' : 'text-red-400'
            }`}
          >
            {artwork.available ? 'Available' : 'Sold Out'}
          </p>
          <p className="text-gray-500">
            ${' '}
            {artwork.discount
              ? (
                  artwork.price -
                  (artwork.price * artwork.discount) / 100
                ).toFixed(2)
              : artwork.price.toFixed(2)}
          </p>
        </div>
        <p className="mt-3">{artwork.description}</p>
      </div>
    </div>
  );
};

export default NewArtwork;
