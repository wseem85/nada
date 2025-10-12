import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import StarRating from '../components/StarRating';

import NadaHelmet from '../components/NadaHelmet';
import { useArtwork, useArtworkReviews } from '../hooks/useArtworkData';

const Reviews = () => {
  const { workId } = useParams();
  const navigate = useNavigate();

  const {
    data: work,
    isLoading: isLoadingWork,
    error: errorLoadingWork,
  } = useArtwork(workId);
  const { data: reviews = [], isLoading: isLoadingReviews } =
    useArtworkReviews(workId);

  // Calculate rating statistics
  const calculateRatingStats = () => {
    if (!reviews?.length) return { average: 0, distribution: [0, 0, 0, 0, 0] };

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    const distribution = [0, 0, 0, 0, 0]; // 1-star to 5-star counts
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });

    return { average, distribution };
  };

  const stats = calculateRatingStats();

  if (isLoadingWork || isLoadingReviews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading reviews...</div>
      </div>
    );
  }

  if (errorLoadingWork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">{errorLoadingWork.message}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NadaHelmet
        sections={[`${work.title}`, 'Reviews']}
        description="Read authentic customer reviews and testimonials for Nada Art Gallery. See what collectors and art enthusiasts say about their artwork purchases and experiences."
        keywords="nada art reviews, artwork testimonials, customer feedback art, art gallery reviews, collector experiences, art purchase reviews, artist reviews, gallery testimonials, customer ratings, art satisfaction reviews"
      />
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="flex items-center underline gap-2 text-brand hover:text-brand-dark mb-4"
        >
          <FaArrowLeft />
          <span>Back to {work.title}</span>
        </button>

        {work && (
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <img
              src={work.images?.[0]}
              alt={work.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Reviews for "{work.title}"
              </h3>
              <p className="text-gray-600">{work.category}</p>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Summary */}
      {reviews?.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {stats.average.toFixed(1)}
              </div>
              <StarRating rating={stats.average} size={20} />
              <div className="text-sm text-gray-600 mt-1">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-4">{rating}</span>
                    <FaStar className="text-text text-sm" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-text h-2 rounded-full"
                        style={{
                          width: `${
                            reviews.length > 0
                              ? (stats.distribution[rating - 1] /
                                  reviews.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {stats.distribution[rating - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No reviews yet</div>
            <div className="text-gray-400">
              Be the first to review this artwork!
            </div>
          </div>
        ) : (
          reviews?.map((review, index) => (
            <motion.div
              key={review._id || index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    review.user?.photo ||
                    '../../src/assets/profile_default_pic.png'
                  }
                  alt={review.user?.name || review.userData?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium capitalize">
                      {review.user?.name ||
                        review.userData?.name ||
                        'Anonymous'}
                    </p>
                    <StarRating rating={review.rating} size={16} />
                  </div>

                  {review.createdAt && (
                    <div className="text-sm text-gray-500 mb-3">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  )}

                  <p className="text-gray-700 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Reviews;
