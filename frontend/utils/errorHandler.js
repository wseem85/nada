// utils/errorHandler.js
export const getErrorMessage = (error) => {
  // Axios error (network or server response error)
  if (error.response) {
    // The server responded with an error status (4xx, 5xx)
    return error.response.data.message || 'An error occurred';
  }

  // Network error (no response received)
  if (error.request) {
    return 'Network error - please check your connection';
  }

  // Other errors (e.g., in request configuration)
  return error.message || 'An unexpected error occurred';
};
