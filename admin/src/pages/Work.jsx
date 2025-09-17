import { useContext } from 'react';
import { useState } from 'react';
import { AppContext } from '../contexts/contexts';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Work = () => {
  const [work, setWork] = useState(undefined);

  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [errorLoadingWork, setErrorLoadingWork] = useState('');
  const { workId } = useParams();

  // const work = artworks.find((el) => el._id === workId);
  const { backendUrl } = useContext(AppContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexMdscreens, setCurrentIndexMdScreens] = useState(0);

  const goToImage1 = (index) => {
    setCurrentIndexMdScreens(index);
  };
  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Calculate the positions for all images
  const getImagePositions = () => {
    if (!work?.images || work.images.length === 0) return [];
    return work.images?.map((_, index) => {
      // Calculate the relative position to the current index
      let position = index - currentIndex;

      // Handle wrapping for infinite effect
      if (position < -Math.floor(work.images.length / 2)) {
        position += work.images.length;
      } else if (position > Math.floor(work.images.length / 2)) {
        position -= work.images.length;
      }

      return { index, position };
    });
  };

  let imagePositions;
  if (work) {
    imagePositions = getImagePositions();
  }

  useEffect(
    function () {
      const fetchData = async () => {
        try {
          setIsLoadingWork(true);

          const artworkResponse = await axios.get(
            backendUrl + `/api/artworks/${workId}`
          );
          const data = artworkResponse.data;

          if (data.status === 'success') {
            setWork(data.data.data);
          }
        } catch (error) {
          console.error('Error fetching artworks:', error);
          setErrorLoadingWork(error.message);
          toast.error(error.message);
        } finally {
          setIsLoadingWork(false);
        }
      };
      fetchData();
    },
    [workId, backendUrl]
  );

  useEffect(() => {
    scrollTo(0, 0);
  });

  // if (work) {
  //   const similars = getSimilarWorks(work, artworks);
  // }
  if (errorLoadingWork) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-3xl text-beige-dark">Something Went Wrong</p>
        <p className="text-red-400">{errorLoadingWork}</p>
      </div>
    );
  }
  if (isLoadingWork) {
    return (
      <>
        <p>Loadinfg ....</p>
        {/* <WorkDesktopSkeleton /> */}
        {/* <WorkMobileSkeleton /> */}
      </>
    );
  }
  return (
    <div className="pl-6 pt-8 pr-4 pb-4">
      {/* Mobile  View */}

      <div className="max-w-6xl mx-auto p-6 lg:hidden">
        {/* Gallery Container */}
        <div className="relative h-96 overflow-hidden rounded-xl bg-gray-100 shadow-lg">
          <div className="flex items-center justify-center h-full">
            <AnimatePresence initial={false}>
              {imagePositions?.map(({ index, position }) => (
                <motion.div
                  key={index}
                  className={`absolute h-5/6 w-5/6 flex items-center justify-center ${
                    position === 0 ? 'z-10' : 'z-0'
                  }`}
                  initial={{
                    x: `${position * 90}%`,
                    scale: position === 0 ? 1 : 0.85,
                    opacity: position === 0 ? 1 : 0.7,
                  }}
                  animate={{
                    x: `${position * 45}%`,
                    scale: position === 0 ? 1 : 0.85,
                    opacity: position === 0 ? 1 : 0.7,
                  }}
                  exit={{
                    x: `${position * 90}%`,
                    scale: position === 0 ? 1 : 0.85,
                    opacity: position === 0 ? 1 : 0.7,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    cursor: position !== 0 ? 'pointer' : 'default',
                  }}
                  onClick={() => position !== 0 && goToImage(index)}
                >
                  <img
                    src={`${work.images[index]}`}
                    alt={`Artwork view ${index + 1}`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Circle Indicators */}
        <div className="flex justify-center mt-8 space-x-3">
          {work.images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-brand scale-110'
                  : 'bg-gray-300 hover:bg-gray-500'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="text-center mt-4 ">
          {currentIndex + 1} / {work.images.length}
        </div>
        <div className="mt-8  lg:hidden">
          <h1 className="font-caveat text-3xl tracking-widest font-semibold text-center">
            {work.title}
          </h1>
          <div className="mt-4 flex justify-between">
            {work.available ? (
              <p className="flex items-center text-green-700">
                <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-500 animate-pulse"></span>
                In Stock
              </p>
            ) : (
              <p className="flex items-center text-red-500">
                <span className="inline-block w-2 h-2 mr-2 rounded-full bg-red-500 animate-pulse"></span>
                Sold out
              </p>
            )}
            {work.available && work.discount ? (
              <p className="relative">
                {' '}
                <span className=" line-through pr-4 opacity-50">
                  ${work.price}
                </span>{' '}
                <span>
                  {' '}
                  $
                  {(work.price - (work.price * work.discount) / 100).toFixed(
                    2
                  )}{' '}
                </span>
                <span className="absolute tracking-tighter text-xs pl-1 top-0">
                  USC
                </span>{' '}
              </p>
            ) : (
              <p className="relative">
                ${work.price}{' '}
                <span className="absolute tracking-tighter text-xs pl-1 top-0">
                  USC
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-4 text-lg tracking-wide">
            <p>
              {work.width}"X {work.height}"
            </p>
            <p>
              {work.categories.map((el, index, arr) =>
                index === arr.length - 1 ? (
                  <span key={el}>{el} </span>
                ) : (
                  <span key={el}>{el} | </span>
                )
              )}
            </p>
          </div>

          <div className="mt-4">
            <p>{work.description}</p>
          </div>
        </div>
      </div>

      {/* Laptop View */}

      <div className="max-w-6xl mx-auto p-6 hidden lg:block">
        {/* Mobille Dots indicators*/}
        <div className="lg:hidden ">
          {/* Your existing carousel implementation */}

          {/* Circle Indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {work.images?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage1(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentIndexMdscreens
                    ? 'bg-brand scale-110'
                    : 'bg-gray-300 hover:bg-gray-500'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Laptop View */}
        <div className="hidden lg:block ">
          <div className="grid grid-cols-[1fr_8fr_5fr] gap-6">
            {/* Left Column - Thumbnails */}
            <div className="flex flex-col space-y-4   max-h-[500px] overflow-y-hidden pr-2">
              {work.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => goToImage1(index)}
                  className={`cursor-pointer rounded-lg border-2 p-1 transition-all duration-200 ${
                    index === currentIndexMdscreens
                      ? 'border-brand scale-105 shadow-md'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={`${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>
              ))}
            </div>

            {/* Middle Column - Main Image */}
            <div className="   rounded-lg  p-4">
              <img
                src={`${work.images[currentIndexMdscreens]}`}
                alt={`Artwork view ${currentIndexMdscreens + 1}`}
                className="max-h-full w-full object-contain"
              />
            </div>

            {/* Right Column - Details */}

            <div className="mt-8  lg:block">
              <h1 className="font-caveat text-3xl tracking-widest font-semibold text-center">
                {work.title}
              </h1>
              <div className="mt-4 flex justify-between">
                {work.available ? (
                  <p className="flex items-center text-green-700">
                    <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-500 animate-pulse"></span>
                    In Stock
                  </p>
                ) : (
                  <p className="flex items-center text-red-500">
                    <span className="inline-block w-2 h-2 mr-2 rounded-full bg-red-500 animate-pulse"></span>
                    Sold out
                  </p>
                )}
                {work.available && work.discount ? (
                  <p className="relative">
                    {' '}
                    <span className=" line-through pr-4 opacity-50">
                      ${work.price}
                    </span>{' '}
                    <span>
                      {' '}
                      $
                      {(
                        work.price -
                        (work.price * work.discount) / 100
                      ).toFixed(2)}{' '}
                    </span>
                    <span className="absolute tracking-tighter text-xs pl-1 top-0">
                      USC
                    </span>{' '}
                  </p>
                ) : (
                  <p className="relative">
                    ${work.price}{' '}
                    <span className="absolute tracking-tighter text-xs pl-1 top-0">
                      USC
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <p>
                  {work.width}"X {work.height}"
                </p>
                <p>
                  {work.categories.map((el, index, arr) =>
                    index !== arr.length - 1 ? (
                      <span key={el}>{el} | </span>
                    ) : (
                      <span key={el}>{el} </span>
                    )
                  )}
                </p>
              </div>
              <div className="mt-8 text-sm">
                <p>{work.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Counter (for mobile/desktop view) */}
        <div className="text-center mt-4 text-gray-600 lg:hidden">
          {currentIndex + 1} / {work.images.length}
        </div>
      </div>
    </div>
  );
};

export default Work;
