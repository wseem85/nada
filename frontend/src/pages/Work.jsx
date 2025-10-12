import React, { useContext, useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import StarRating from '../components/StarRating';
import RatingModal from '../components/RatingModal';

// import { reviews } from '../assets/assets';
import {
  FaStar,
  FaHeart,
  FaShare,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
} from 'react-icons/fa';
import { AuthContext, CartContext } from '../contexts/contexts';
import { toast } from 'react-toastify';
import WorkMobileSkeleton from '../skeletons/WorkMobileSkeleton';
import WorkDesktopSkeleton from '../skeletons/WorkDesktopSkeleton';
import NadaHelmet from '../components/NadaHelmet';
import {
  useArtwork,
  useSimilarArtworks,
  useArtworkReviews,
  useSubmitReview,
} from '../hooks/useArtworkData';

const Work = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { workId } = useParams();

  // TanStack Query hooks
  const {
    data: work,
    isLoading: isLoadingWork,
    error: errorLoadingWork,
  } = useArtwork(workId);

  const { data: similars = [], isLoading: isLoadingSimilars } =
    useSimilarArtworks(workId);

  const { data: reviews = [], isLoading: isLoadingReviews } =
    useArtworkReviews(workId);

  const submitReviewMutation = useSubmitReview();

  // Local state for UI interactions
  const [inCart, setInCart] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [errorRating, setErrorRating] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  let topReview;
  if (reviews?.length) {
    topReview = reviews?.reduce((highest, current) => {
      return current.rating > highest.rating ? current : highest;
    }, reviews[0]);
  }

  const handleRate = useCallback(
    (rating, review) => {
      setUserRating(rating);
      setUserReview(review);

      submitReviewMutation.mutate({
        workId,
        rating,
        review,
      });
    },
    [workId, submitReviewMutation]
  );

  // Enhanced cart handling functions
  const handleAddToCart = useCallback(async () => {
    if (!work?.available) return;

    setIsAddingToCart(true);
    try {
      await addToCart(work._id);
      setInCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [work, addToCart]);

  const handleRemoveFromCart = useCallback(async () => {
    setIsRemovingFromCart(true);
    try {
      await removeFromCart(work._id);
      setInCart(false);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsRemovingFromCart(false);
    }
  }, [work, removeFromCart]);

  // Wishlist functionality
  const handleWishlistToggle = useCallback(() => {
    if (!user) {
      toast.info('Please login to add items to your wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  }, [user, isWishlisted]);

  // Social sharing functionality
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: work.title,
        text: work.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }, [work]);

  // Image zoom and pan functionality
  const handleImageZoom = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setImagePosition({ x, y });
    setImageZoom((prev) => (prev === 1 ? 2 : 1));
  }, []);

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

  // Update cart status when work or cart changes
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

  // Handle loading and error states
  if (errorLoadingWork) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-3xl text-beige-dark">Something Went Wrong</p>
        <p className="text-red-400">{errorLoadingWork.message}</p>
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

  if (!work) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-3xl text-beige-dark">Artwork not found</p>
      </div>
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
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="flex items-center underline gap-2 text-brand hover:text-brand-dark mb-4"
      >
        <FaArrowLeft />
        <span>Back to Gallery</span>
      </button>

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
          <div className="text-center mt-6 space-y-3">
            {/* Action buttons */}
            <div className="flex gap-3">
              {!inCart && work.available ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? 'Adding...' : 'Add To Cart'}
                </button>
              ) : null}
              {inCart && work.available ? (
                <button
                  onClick={handleRemoveFromCart}
                  disabled={isRemovingFromCart}
                  className="flex-1 hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRemovingFromCart ? 'Removing...' : 'Remove From Cart'}
                </button>
              ) : null}

              {/* Wishlist button */}
              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-sm border transition-all duration-200 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : 'bg-transparent border-beige hover:bg-white hover:border-beige-dark'
                }`}
              >
                <FaHeart
                  className={isWishlisted ? 'fill-current' : 'stroke-current'}
                />
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-4 rounded-sm border border-beige bg-transparent hover:bg-white hover:border-beige-dark transition-all duration-200"
              >
                <FaShare />
              </button>
            </div>
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
          {reviews?.length ? (
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
            <div className="rounded-lg p-4 relative">
              <div className="relative group">
                <img
                  src={`${work.images[currentIndexMdscreens]}`}
                  alt={`Artwork view ${currentIndexMdscreens + 1}`}
                  className="max-h-full w-full object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={handleImageZoom}
                  style={{
                    transform: `scale(${imageZoom})`,
                    transformOrigin: `${imagePosition.x}px ${imagePosition.y}px`,
                  }}
                />

                {/* Image overlay with zoom icon */}
                <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-80 p-3 rounded-full hover:bg-opacity-100"
                  >
                    <FaExpand className="text-gray-700" />
                  </button>
                </div>

                {/* Navigation arrows */}
                {work.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        goToImage1(
                          currentIndexMdscreens > 0
                            ? currentIndexMdscreens - 1
                            : work.images.length - 1
                        )
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <FaChevronLeft className="text-gray-700" />
                    </button>
                    <button
                      onClick={() =>
                        goToImage1(
                          currentIndexMdscreens < work.images.length - 1
                            ? currentIndexMdscreens + 1
                            : 0
                        )
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <FaChevronRight className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>

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
              <div className="text-center mt-6 space-y-3">
                {/* Action buttons */}
                <div className="flex gap-3">
                  {!inCart && work.available ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="flex-1 hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingToCart ? 'Adding...' : 'Add To Cart'}
                    </button>
                  ) : null}
                  {inCart && work.available ? (
                    <button
                      onClick={handleRemoveFromCart}
                      disabled={isRemovingFromCart}
                      className="flex-1 hover:bg-white hover:border-beige-dark transition-all duration-200 bg-transparent rounded-sm border border-beige px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRemovingFromCart ? 'Removing...' : 'Remove From Cart'}
                    </button>
                  ) : null}

                  {/* Wishlist button */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-4 rounded-sm border transition-all duration-200 ${
                      isWishlisted
                        ? 'bg-red-50 border-red-300 text-red-600'
                        : 'bg-transparent border-beige hover:bg-white hover:border-beige-dark'
                    }`}
                  >
                    <FaHeart
                      className={
                        isWishlisted ? 'fill-current' : 'stroke-current'
                      }
                    />
                  </button>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-4 rounded-sm border border-beige bg-transparent hover:bg-white hover:border-beige-dark transition-all duration-200"
                  >
                    <FaShare />
                  </button>
                </div>
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

              {reviews?.length ? (
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

      <div className="mt-6">
        <p className="text-xl tracking-wide mb-6 font-medium text-center">
          Similar Artworks On Stock
        </p>
        <div className="xl:flex gap-8">
          {isLoadingSimilars ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige"></div>
            </div>
          ) : similars.length ? (
            <div className="flex flex-wrap place-center mx-auto justify-center gap-3 gap-y-6 md:gap-x-6">
              {similars.slice(0, 5).map((el) => (
                <NavLink
                  key={el._id}
                  to={`/gallery/${el._id}`}
                  onClick={() => scrollTo(0, 0)}
                >
                  <div className="flex flex-col mx-auto justify-center p-2 rounded-md">
                    <div className="mb-2">
                      <img
                        className="w-32 inline-block mx-auto"
                        src={`${el.images[0]}`}
                        alt=""
                      />
                    </div>
                    <p className="font-semibold mb-1 text-center">{el.title}</p>
                    <p className="text-center text-lg">$ {el.price}</p>
                  </div>
                </NavLink>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No similar artworks found
            </p>
          )}
        </div>
      </div>

      {/* Image Modal for Full Screen Viewing */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${work.images[currentIndexMdscreens]}`}
                alt={`Artwork view ${currentIndexMdscreens + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Close button */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full"
              >
                ✕
              </button>

              {/* Navigation arrows in modal */}
              {work.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      goToImage1(
                        currentIndexMdscreens > 0
                          ? currentIndexMdscreens - 1
                          : work.images.length - 1
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full"
                  >
                    <FaChevronLeft className="text-gray-700" />
                  </button>
                  <button
                    onClick={() =>
                      goToImage1(
                        currentIndexMdscreens < work.images.length - 1
                          ? currentIndexMdscreens + 1
                          : 0
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full"
                  >
                    <FaChevronRight className="text-gray-700" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm">
                {currentIndexMdscreens + 1} / {work.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Work;
