import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assets } from '../assets/assets';
import ArtworkItem from '../components/ArtworkItem';
import SectionTitle from '../components/SectionTitle';
import { BsFilterLeft } from 'react-icons/bs';
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from 'react-icons/md';
import FiltersMobileModal from '../components/FiltersMobileModal';
import { data, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import GallerySkeleton from '../skeletons/GallerySkeleton';
import NadaHelmet from '../components/NadaHelmet';
import axios from 'axios';
import { useCallback } from 'react';
import { getErrorMessage } from '../../utils/errorHandler';

const Gallery = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const worksPerPage = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // State for filters and pagination
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

  // Build query string for API
  const buildQueryString = useCallback(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('page', currentPage.toString());
    newSearchParams.set('limit', worksPerPage.toString());

    if (filters.available === 'available') {
      newSearchParams.set('available', 'true');
    } else if (filters.available === 'not-available') {
      newSearchParams.set('available', 'false');
    }

    if (filters.size) {
      const width = filters.size.slice(0, 2);
      const height = filters.size.slice(2);
      newSearchParams.set('width', width);
      newSearchParams.set('height', height);
    }

    if (filters.maxPrice !== 10000) {
      newSearchParams.set('price[lte]', filters.maxPrice.toString());
    }

    return newSearchParams.toString();
  }, [currentPage, filters.available, filters.maxPrice, filters.size]);

  // React Query for artworks
  const {
    data: artworksData,
    isLoading: isLoadingArtworks,
    error: errorLoadingArtworks,
  } = useQuery({
    queryKey: ['artworks', buildQueryString()], // Cache key includes all filters and pagination
    queryFn: async () => {
      const queryString = buildQueryString();
      try {
        const response = await axios.get(
          `${backendUrl}/api/artworks?${queryString}`,
          { timeout: 8000 }
        );

        if (response.data.status === 'success') {
          return {
            artworks: response.data.data,
            totalFilteredCount: response.data.totalFilteredCount,
            totalNumPages: Math.ceil(
              response.data.totalFilteredCount / worksPerPage
            ),
          };
        }
      } catch (err) {
        const message = `${getErrorMessage(err)}: Failed To get Artworks`;
        toast.error(message);
        console.log(err);
        throw new Error(message);
      }
    },
    keepPreviousData: true, // For Smooth pagination

    staleTime: 5 * 60 * 1000, // Data stays fresh for 2 minutes
  });

  // Extract data from query result
  const artworks = artworksData?.artworks.data || [];
  const totalFilteredArtworksCount = artworksData?.totalFilteredCount || 0;
  const totalNumPages = artworksData?.totalNumPages || 1;
  console.log(artworksData);
  // Update URL when filters/page change
  useEffect(() => {
    const queryString = buildQueryString();
    if (queryString) {
      setSearchParams(new URLSearchParams(queryString));
    } else {
      setSearchParams({});
    }
  }, [filters, currentPage, setSearchParams, buildQueryString]);

  // Error handling
  if (errorLoadingArtworks) {
    return (
      <div className="pt-8 min-h-screen">
        <NadaHelmet
          sections={['Gallery']}
          description="the Gallery,all artworks made by Nada with detailed information"
          keywords="gallery, Gallery, Artworks, Nada, nada, NADA, art, artworks, painting, purchase, online"
        />
        <SectionTitle title="Art Gallery" />
        <div className="flex flex-col gap-2 justify-center items-center">
          <h3 className="text-text/80 text-xl text-center">
            Opps, Something went wrong!
          </h3>
          <p className="text-sm text-center text-red-400">
            {errorLoadingArtworks.message || 'Unknown Error'}
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

      <div className="mb-8 flex justify-between items-center mt-8">
        <button
          onClick={() => setShowFilters((state) => !state)}
          className="flex gap-1 items-center text-2xl tracking-widest"
        >
          <BsFilterLeft className="text-2xl" /> Filter
        </button>

        <div className="text-xs tracking-wide">
          <span className="sm:pl-3"></span>
          Total (
          <span>{isLoadingArtworks ? '...' : totalFilteredArtworksCount}</span>)
          Products
        </div>
      </div>

      {isLoadingArtworks && <GallerySkeleton />}

      {!isLoadingArtworks && artworks.length > 0 && (
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
                  className={`w-8 h-8 border flex justify-center items-center cursor-pointer ${
                    currentPage === index + 1
                      ? 'text-text border-text'
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-12 max-w-6xl mx-auto mb-16">
            {artworks.slice(0, 3).map((artworkItem) => (
              <div key={artworkItem._id} className="grid gap-4">
                <ArtworkItem artworkItem={artworkItem} />
              </div>
            ))}
            {artworks.slice(3).map((artworkItem) => (
              <div key={artworkItem._id} className="grid gap-4">
                <ArtworkItem artworkItem={artworkItem} />
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoadingArtworks && artworks.length === 0 && (
        <div className="min-h-screen flex flex-col gap-8">
          <p className="text-center text-xl">
            No products match the filters you selected
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
            Remove All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
