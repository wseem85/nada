import React from 'react';

const Stars = ({ num, size = 18, color = '#257180' }) => {
  // Ensure rating is between 0 and 5
  // const clampedRating = Math.min(Math.max(parseFloat(rating) || 0, 0), 5);
  // const fullStars = Math.floor(clampedRating);
  // const hasHalfStar = clampedRating % 1 !== 0;
  // const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const emptyStartsNum = 5 - num;
  if (!emptyStartsNum) {
    return (
      <div className="flex">
        {/* Full stars */}
        {[...Array(num)].map((_, i) => (
          <svg
            key={`full-${i}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={color}
            width={size}
            height={size}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex items-center">
        <div className="flex">
          {/* Full stars */}
          {[...Array(num)].map((_, i) => (
            <svg
              key={`full-${i}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={color}
              width={size}
              height={size}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        {/* Empty stars */}
        <div className="flex">
          {[...Array(emptyStartsNum)].map((_, i) => (
            <svg
              key={`empty-${i}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              width={size}
              height={size}
            >
              <path
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"
              />
            </svg>
          ))}
        </div>
      </div>
    );
  }
};

export default Stars;
