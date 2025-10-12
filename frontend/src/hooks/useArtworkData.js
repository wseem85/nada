import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/errorHandler';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Fetch single artwork
export const useArtwork = (workId) => {
  return useQuery({
    queryKey: ['artwork', workId],
    queryFn: async () => {
      const { data } = await axios.get(`${backendUrl}/api/artworks/${workId}`);
      return data.data.data;
    },
    enabled: !!workId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch similar artworks
export const useSimilarArtworks = (workId) => {
  return useQuery({
    queryKey: ['similarArtworks', workId],
    queryFn: async () => {
      const { data } = await axios.get(`${backendUrl}/api/artworks/${workId}/similars`);
      return data.data.data;
    },
    enabled: !!workId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch artwork reviews
export const useArtworkReviews = (workId) => {
  return useQuery({
    queryKey: ['artworkReviews', workId],
    queryFn: async () => {
      const { data } = await axios.get(`${backendUrl}/api/artworks/${workId}/reviews`);
      return data.data.reviews;
    },
    enabled: !!workId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Submit review mutation
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workId, rating, review }) => {
      const { data } = await axios.post(`${backendUrl}/api/artworks/${workId}/reviews`, {
        review,
        rating,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews and artwork data
      queryClient.invalidateQueries(['artworkReviews', variables.workId]);
      queryClient.invalidateQueries(['artwork', variables.workId]);
      toast.success('Review submitted successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// Add to cart mutation
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artworkId) => {
      // This will be handled by CartContext, but we can add optimistic updates here
      return artworkId;
    },
    onSuccess: (artworkId) => {
      // Invalidate cart-related queries
      queryClient.invalidateQueries(['cart']);
      toast.success('Item added to cart');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// Remove from cart mutation
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artworkId) => {
      // This will be handled by CartContext, but we can add optimistic updates here
      return artworkId;
    },
    onSuccess: (artworkId) => {
      // Invalidate cart-related queries
      queryClient.invalidateQueries(['cart']);
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
