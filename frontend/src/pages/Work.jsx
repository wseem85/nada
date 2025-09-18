import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import StarRating from '../components/StarRating';
import RatingModal from '../components/RatingModal';

// import { reviews } from '../assets/assets';
import { FaStar } from 'react-icons/fa';
import { AppContext, AuthContext, CartContext } from '../contexts/contexts';
import axios from 'axios';
import { toast } from 'react-toastify';
import WorkMobileSkeleton from '../skeletons/WorkMobileSkeleton';
import WorkDesktopSkeleton from '../skeletons/WorkDesktopSkeleton';
import { getErrorMessage } from '../../utils/errorHandler';
import NadaHelmet from '../components/NadaHelmet';

const Work = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [work, setWork] = useState(undefined);

  const [reviews, setReviews] = useState();
  const [inCart, setInCart] = useState(
    cart?.find((el) => el.artwork._id === work?._id) || false
  );

  const [similars, setSimilars] = useState([]);
  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [errorLoadingWork, setErrorLoadingWork] = useState('');
  const { workId } = useParams();

  // const work = artworks.find((el) => el._id === workId);
  const { backendUrl } = useContext(AppContext);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [errorRating, setErrorRating] = useState('');

  let topReview;
  if (reviews?.length) {
    topReview = reviews?.reduce((highest, current) => {
      return current.rating > highest.rating ? current : highest;
    }, reviews[0]);
  }

  const handleRate = async (rating, review) => {
    setUserRating(rating);
    setUserReview(review);

    try {
      const { data } = await axios.post(
        backendUrl + `/api/artworks/${workId}/reviews`,
        { review, rating }
      );

      // After successful submission, refetch reviews and work data
      const [updatedReviewsResponse, updatedWorkResponse] = await Promise.all([
        axios.get(backendUrl + `/api/artworks/${workId}/reviews`),
        axios.get(backendUrl + `/api/artworks/${workId}`), // To get updated avgRating
      ]);

      if (updatedReviewsResponse.data.status === 'success') {
        setReviews(updatedReviewsResponse.data.data.data);
      }

      if (updatedWorkResponse.data.status === 'success') {
        setWork(updatedWorkResponse.data.data.data);
      }

      // Show success message
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.log(err);
    }
  };

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

          const [artworkResponse, similarsResponse, reviewsResponse] =
            await Promise.all([
              axios.get(backendUrl + `/api/artworks/${workId}`),
              axios.get(backendUrl + `/api/artworks/${workId}/similars`),
              axios.get(backendUrl + `/api/artworks/${workId}/reviews`),
            ]);
          const data = artworkResponse.data;
          const similars = similarsResponse.data;
          const currentReviews = reviewsResponse.data;
          if (data.status === 'success') {
            setWork(data.data.data);
          }
          if (similars.status === 'success') {
            setSimilars(similars.data.data);
          }
          if (currentReviews.status === 'success') {
            setReviews(currentReviews.data.data);
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
    console.log(cart);
    const inCart = cart.some((el) => el.artwork._id === work?._id);
    console.log(inCart);
    if (inCart) setInCart(true);
    else setInCart(false);
  }, [cart, work?._id]);
  useEffect(() => {
    if (reviews?.length) {
      const currentUserReview = reviews.filter(
        (el) => el.user._id === user._id
      )[0];

      if (currentUserReview?._id) {
        setUserRating(currentUserReview.rating);
        setUserReview(currentUserReview.review);
      }
    }
  }, [reviews, user._id]);
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
        <WorkDesktopSkeleton />
        <WorkMobileSkeleton />
      </>
    );
  }
  return (
    <div>
      <NadaHelmet
        sections={['Artwork', work.title]}
        description={`${work.description} Explore this unique piece by Nada art available at Nada Art Gallery. Learn about the technique, dimensions, and story behind this work.`}
        keywords={`${work.title}, Nada work, ${work.categories[0]}  art, ${work.categories[1]} painting, original art for sale, limited edition art, art investment piece, gallery artwork, collectible art, nada collection`}
      />
      {/* Mobile  View */}

      <div className="max-w-6xl mx-auto p-6 md:hidden">
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
        <div className="mt-8  md:hidden">
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
          <div className="text-center mt-6">
            {!inCart && work.available ? (
              <button
                onClick={() => addToCart(work._id)}
                className="hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-12 py-4 mx-auto w-full"
              >
                Add To Cart
              </button>
            ) : null}
            {inCart && work.available ? (
              <button
                onClick={() => removeFromCart(work._id)}
                className="hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-12 py-4 mx-auto w-full"
              >
                Remove From Cart
              </button>
            ) : null}
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
          <div className="mt-4 flex gap-2 justify-between ">
            <StarRating rating={work.avgRating} />
            {!userRating ? (
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="border px-12 py-2 bg-transparent border-beige hover:bg-white hover:border-beige-dark transition-all duration-200"
              >
                Rate
              </button>
            ) : (
              <p className="border text-xs px-4 text-center py-2 bg-transparent border-beige">
                You rated As {userRating}
              </p>
            )}
            <RatingModal
              work={work}
              isOpen={isRatingModalOpen}
              onClose={() => setIsRatingModalOpen(false)}
              onRate={handleRate}
              currentRating={userRating}
              currentReview={userReview}
              onError={setErrorRating}
              error={errorRating}
            />
          </div>
          {reviews.length ? (
            <div className="flex flex-col gap-3 mt-5 bg-gray-50 p-4 md:hidden">
              {!userRating && topReview ? (
                <div className="flex flex-col gap-3">
                  <p className="text-lg font-medium tracking-wider">Reviews</p>

                  <div className="flex flex-col gap-3 border-b border-beige mb-4 pb-3 ">
                    <div className="flex gap-2  ">
                      <img
                        className="w-6"
                        src={`${
                          topReview.user.photo
                            ? topReview.user.photo
                            : '../../src/assets/profile_default_pic.png'
                        }`}
                        alt=""
                      />
                      <p className="text-md font-medium capitalize">
                        {topReview.user.name}
                      </p>
                      <p className="flex items-center gap-1">
                        <FaStar /> <span>{topReview.rating}</span>
                      </p>
                    </div>
                    <p> {topReview.review}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('reviews');
                      scrollTo(0, 0);
                    }}
                    className="flex gap-2 items-center underline"
                  >
                    All {reviews.length} Reviews
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-lg font-medium tracking-wider">Reviews</p>

                  <div className="flex flex-col gap-3 border-b border-beige mb-4 pb-3 ">
                    <div className="flex gap-2  ">
                      <img
                        className="w-6"
                        src={`${
                          user.photo
                            ? user.photo
                            : '../../src/assets/profile_default_pic.png'
                        }`}
                        alt=""
                      />
                      <p className="text-md font-medium capitalize">
                        {user.name}
                      </p>
                      <p className="flex items-center gap-1">
                        <FaStar /> <span>{userRating}</span>
                      </p>
                    </div>
                    <p> {userReview}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('reviews');
                      scrollTo(0, 0);
                    }}
                    className="flex gap-2 items-center underline"
                  >
                    All {reviews.length} Reviews
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="bg-white py-6 px-2 mt-4">
              No reviews yet , Be the first one rate this artwork
            </p>
          )}
          <div className="mt-4">
            <p>{work.description}</p>
          </div>
        </div>
      </div>

      {/* Laptop View */}

      <div className="max-w-6xl mx-auto p-6 hidden md:block">
        {/* Mobille Dots indicators*/}
        <div className="md:hidden ">
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
        <div className="hidden md:block ">
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
              <div className="mt-8 text-sm">
                <p>{work.description}</p>
              </div>
            </div>

            {/* Right Column - Details */}

            <div className="mt-8  md:block">
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
              <div className="text-center mt-6">
                {!inCart ? (
                  <button
                    onClick={() => addToCart(work._id)}
                    className="hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-12 py-4 mx-auto w-full"
                  >
                    Add To Cart
                  </button>
                ) : (
                  <button
                    onClick={() => removeFromCart(work._id)}
                    className="hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-12 py-4 mx-auto w-full"
                  >
                    Remove From Cart
                  </button>
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
              <div className="mt-4 flex flex-col lg:flex-row gap-2 lg:gap-6 justify-between ">
                <StarRating rating={work.avgRating} />
                {!userRating ? (
                  <button
                    onClick={() => setIsRatingModalOpen(true)}
                    className="border px-12 py-2 bg-transparent border-beige hover:bg-white hover:border-beige-dark transition-all duration-200"
                  >
                    Rate
                  </button>
                ) : (
                  <p className="border text-xs px-4 text-venter py-2 bg-transparent border-beige">
                    You rated As {userRating}
                  </p>
                )}
                <RatingModal
                  work={work}
                  isOpen={isRatingModalOpen}
                  onClose={() => setIsRatingModalOpen(false)}
                  onRate={handleRate}
                  currentRating={userRating}
                  currentReview={userReview}
                  onError={setErrorRating}
                  error={errorRating}
                />
              </div>

              {reviews.length ? (
                <div className=" flex-col gap-3 mt-5 bg-gray-50 p-4 hidden md:flex">
                  {!userRating && topReview ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-lg font-medium tracking-wider">
                        Reviews
                      </p>

                      <div className="flex flex-col gap-3 border-b border-beige mb-4 pb-3 ">
                        <div className="flex gap-2  ">
                          <img
                            className="w-6"
                            src={`${
                              topReview.user.photo
                                ? topReview.user.photo
                                : '../../src/assets/profile_default_pic.png'
                            }`}
                            alt=""
                          />
                          <p className="text-md font-medium capitalize">
                            {topReview.user.name}
                          </p>
                          <p className="flex items-center gap-1">
                            <FaStar /> <span>{topReview.rating}</span>
                          </p>
                        </div>
                        <p> {topReview.review}</p>
                      </div>

                      <button
                        onClick={() => {
                          navigate('reviews');
                          scrollTo(0, 0);
                        }}
                        className="flex gap-2 items-center underline"
                      >
                        All {reviews.length} Reviews
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-lg font-medium tracking-wider">
                        Reviews
                      </p>

                      <div className="flex flex-col gap-3 border-b border-beige mb-4 pb-3 ">
                        <div className="flex gap-2  ">
                          <img
                            className="w-6"
                            src={`${
                              user.photo
                                ? user.photo
                                : '../../src/assets/profile_default_pic.png'
                            }`}
                            alt=""
                          />
                          <p className="text-md font-medium capitalize">
                            {user.name}
                          </p>
                          <p className="flex items-center gap-1">
                            <FaStar /> <span>{userRating}</span>
                          </p>
                        </div>
                        <p> {userReview}</p>
                      </div>

                      <button
                        onClick={() => {
                          navigate('reviews');
                          scrollTo(0, 0);
                        }}
                        className="flex gap-2 items-center underline"
                      >
                        All {reviews.length} Reviews
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="bg-white py-6 px-2 mt-4">
                  No reviews yet , Be the first one rate this artwork
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image Counter (for mobile/desktop view) */}
        <div className="text-center mt-4 text-gray-600 md:hidden">
          {currentIndex + 1} / {work.images.length}
        </div>
      </div>

      {!isLoadingWork ? (
        <div className="mt-6">
          <p className="  text-xl tracking-wide mb-6 font-medium text-center  ">
            Similar Artworks On Stock
          </p>
          <div className="xl:flex gap-8">
            {similars.length ? (
              <div className="flex flex-wrap place-center mx-auto justify-center  gap-3 gap-y-6 md:gap-x-6 ">
                {similars.slice(0, 5).map((el) => (
                  <NavLink
                    key={el._id}
                    to={`/gallery/${el._id}`}
                    onClick={() => scrollTo(0, 0)}
                  >
                    <div className="flex flex-col mx-auto justify-center  p-2 rounded-md">
                      <div className="mb-2 ">
                        <img
                          className="w-32 inline-block mx-auto"
                          src={`${el.images[0]}`}
                          alt=""
                        />
                      </div>
                      <p className=" font-semibold mb-1 text-center">
                        {el.title}
                      </p>
                      <p className="text-center text-lg">$ {el.price}</p>
                    </div>
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Work;
