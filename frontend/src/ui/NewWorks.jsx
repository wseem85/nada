import React from 'react';
// import { artworks } from '../assets/assets';
import NewArtwork from '../components/NewArtwork';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

import NewArtworkSkeleton from '../skeletons/NewArtworkSkeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/errorHandler';
export const NewWorks = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    data: newArtworks = [],
    isLoading: isLoadingNewArtworks,
    error: errorLoadingNewArtworks,
    status,
  } = useQuery({
    queryKey: ['newArtworks'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          backendUrl +
            '/api/artworks?page=1&limit=3&fields=title,price,available,width,height,discount,description,images,createdAt',
          { timeout: 8000 }
        );
        return data.data.data;
      } catch (err) {
        const message = `${getErrorMessage(err)}: Failed To get Artworks`;
        toast.error(message);
        console.log(err);
        throw new Error(message);
      }
    },
    // staleTime: 5 * 60 * 1000,
    retry: 1, // Only retry once
    retryDelay: 1000,
    // This prevents React Query from throwing errors to the boundary
    // useErrorBoundary: false,
  });

  return (
    <section className="mt-20 px-10  ">
      <SectionTitle title="New Artworks" />
      {status === 'error' ? (
        <div className="space-y-12 flex justify-center items-center max-w-3xl mx-auto">
          <p className="text-center ">
            <p className="text-sm text-red-500">
              {errorLoadingNewArtworks.message || 'Unknown error'}:{' '}
            </p>{' '}
            There is a Problem getting New Artwork, mostly because you can not
            connect our server
          </p>
        </div>
      ) : null}
      {isLoadingNewArtworks ? (
        <div className="space-y-12">
          {[1, 2, 3].map((el) => (
            <NewArtworkSkeleton key={el} />
          ))}
        </div>
      ) : null}
      {!errorLoadingNewArtworks && !isLoadingNewArtworks ? (
        <div className="space-y-12 flex flex-col justify-center items-center  max-w-4xl mx-auto">
          {newArtworks.map((artwork) => (
            <NewArtwork key={artwork._id} artwork={artwork} />
          ))}
        </div>
      ) : null}
    </section>
  );
};
