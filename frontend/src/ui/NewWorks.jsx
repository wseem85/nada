import React, { useContext } from 'react';
import { artworks } from '../assets/assets';
import NewArtwork from '../components/NewArtwork';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { AppContext } from '../contexts/contexts';
import NewArtworkSkeleton from '../skeletons/NewArtworkSkeleton';
export const NewWorks = () => {
  const { newArtworks, isLoadingNewArtworks, errorLoadingNewArtworks } =
    useContext(AppContext);

  return (
    <section className="mt-20 px-10  ">
      <SectionTitle title="New Artworks" />
      {errorLoadingNewArtworks ? (
        <div className="space-y-12 flex justify-center items-center max-w-3xl mx-auto">
          <p className="text-center text-red-500">
            <p className="text-sm">{errorLoadingNewArtworks}: </p> There is a
            Problem getting New Artwork
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
