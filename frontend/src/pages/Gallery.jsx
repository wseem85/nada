import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
// import { artworks } from '../assets/assets';
import ArtworkItem from '../components/ArtworkItem';
import SectionTitle from '../components/SectionTitle';
import { BsFilterLeft } from 'react-icons/bs';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

import FiltersMobileModal from '../components/FiltersMobileModal';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../contexts/contexts';
import { toast } from 'react-toastify';
import GallerySkeleton from '../skeletons/GallerySkeleton';
import NadaHelmet from '../components/NadaHelmet';

const Gallery = () => {
  const {
    getArtworks,
    artworks,
    totalFilteredArtworksCount,
    worksPerPage,
    isLoadingArtworks,
    errorLoadingArtworks,
    totalNumPages,
  } = useContext(AppContext);
  // console.log(totalNumPages);
  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    available: searchParams.get('available') || '',
    size:
      (searchParams.get('width') &&
        searchParams.get('height') &&
        searchParams.get('width') + searchParams.get('height')) ||
      '',
    maxPrice: searchParams.get('price') || 10000,
  });
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    // Create new URLSearchParams object
    const newSearchParams = new URLSearchParams();

    newSearchParams.set('page', currentPage);
    newSearchParams.set('limit', worksPerPage);
    // Only add available if it has a value
    if (filters.available === 'available') {
      newSearchParams.set('available', 'true');
    } else if (filters.available === 'not-available') {
      newSearchParams.set('available', 'false');
    }

    // Only add size dimensions if size has a value
    if (filters.size) {
      const width = filters.size.slice(0, 2);
      const height = filters.size.slice(2);
      newSearchParams.set('width', width);
      newSearchParams.set('height', height);
    }

    // Only add price filter if it's not the default value
    if (filters.maxPrice !== 10000) {
      newSearchParams.set('price[lte]', filters.maxPrice.toString());
    }

    // Update URL only if there are any parameters
    if (Array.from(newSearchParams).length > 0) {
      setSearchParams(newSearchParams);
    } else {
      // If no filters, clear the URL parameters
      setSearchParams({});
    }
    /// Getting artworks
    // Async function to fetch data
    const fetchData = async () => {
      try {
        // Use the NEW search params, not the old ones from state
        const queryString = newSearchParams.toString();
        await getArtworks(queryString);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        toast.error(error.message);
      }
    };

    // Call the async function
    fetchData();
  }, [filters, currentPage]);
  if (errorLoadingArtworks) {
    return (
      <div className="pt-8 min-h-screen  ">
        <NadaHelmet
          sections={['Gallery']}
          description="the Gallery,all artworks made by Nada with detailed information"
          keywords="gallery, Gallery, Artworks, Nada, nada, NADA, art, artworks, painting, purchase, online "
        />
        <SectionTitle title="Art Gallery" />
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-red-400 text-xl text-center">
            {' '}
            {errorLoadingArtworks}
          </p>
          <p className="text-sm text-xenter text-gray-400">
            Please check Your internet Connection and Try Again!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <NadaHelmet
        sections={['Gallery']}
        description="Explore the Nada Art Gallery collection featuring contemporary paintings, sculptures, digital art, and mixed media works from emerging and established artists."
        keywords="nada art gallery, contemporary art collection, paintings for sale, sculptures exhibition, digital art gallery, mixed media artwork, emerging artists, established painters, art collection, buy art online, gallery artworks, visual art display"
      />
      <SectionTitle title="Art Gallery" />
      <div className="mb-8 flex  justify-between items-center mt-8">
        <button
          onClick={() => setShowFilters((state) => !state)}
          className="flex gap-1 items-center text-2xl tracking-widest "
        >
          {' '}
          <BsFilterLeft className="text-2xl" /> Filter
        </button>

        <div className="text-xs tracking-wide ">
          <span className="sm:pl-3"></span>
          Total (
          <span>
            {isLoadingArtworks ? '...' : totalFilteredArtworksCount})
          </span>{' '}
          Products
        </div>
      </div>
      {isLoadingArtworks && <GallerySkeleton />}
      {!isLoadingArtworks && !errorLoadingArtworks && artworks.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6 px-6 sm:px-12 max-w-xl mx-auto">
            <button
              className="p-2"
              disabled={currentPage === 1}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage((page) => page - 1);
                } else {
                  setCurrentPage(totalNumPages);
                }
              }}
            >
              <MdOutlineKeyboardArrowLeft
                className={`text-3xl text-beige-dark hover:text-text transition-all duration-150 ${
                  currentPage === 1 ? 'opacity-40' : ''
                }`}
              />
            </button>
            <div className="flex gap-3">
              {Array.from(
                { length: totalNumPages },
                (_, index) => index + 1
              ).map((item, index) => (
                <div
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 border  flex justify-center items-center cursor-pointer ${
                    currentPage === index + 1
                      ? 'text-text border-text '
                      : 'text-beige-dark border-beige'
                  }`}
                  key={index}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <button
              className="p-2"
              onClick={() => {
                if (currentPage < totalNumPages) {
                  setCurrentPage((page) => page + 1);
                } else {
                  setCurrentPage(1);
                }
              }}
            >
              <MdOutlineKeyboardArrowRight
                className={`text-3xl text-beige-dark hover:text-text transition-all duration-150 ${
                  currentPage === totalNumPages ? 'opacity-40' : ''
                }`}
              />
            </button>
          </div>

          <FiltersMobileModal
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            setCurrentPage={setCurrentPage}
          />

          <div className="space-y-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto w-full place-items-center ">
            {artworks.map((artworkItem, index) => (
              <ArtworkItem key={artworkItem._id} artworkItem={artworkItem} />
            ))}
          </div>
        </>
      ) : null}
      {artworks.length === 0 ? (
        <div className="min-h-screen flex flex-col gap-8 ">
          <p className="text-center text-xl">
            {' '}
            No Products matches filter you choose
          </p>
          <button
            onClick={() =>
              setFilters({
                available: '',
                size: '',
                maxPrice: 10000,
              })
            }
            className="border w-[200px] mx-auto border-beige px-6 py-2 hover:border-beige-dark hover:bg-white transition-colors duration-200"
          >
            Remove All Filters{' '}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Gallery;
