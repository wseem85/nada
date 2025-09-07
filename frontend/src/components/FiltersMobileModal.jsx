import React, { useEffect, useState } from 'react';
import { BsFilterLeft } from 'react-icons/bs';
import { HiOutlinePlusSm, HiOutlineMinusSm } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

const FiltersMobileModal = ({
  filters,
  showFilters,
  setFilters,
  setShowFilters,
  setCurrentPage,
}) => {
  const [showAvaiabilityFilters, SetShowAvaiabilityFilters] = useState(false);
  const [showSizeFilters, SetShowSizeFilters] = useState(false);
  const [showPriceFilters, SetShowPriceFilters] = useState(false);

  return (
    <div>
      {showFilters && (
        <div className="fixed inset-0 z-50 min-h-screen">
          <div className="absolute inset-0 bg-transparent  backdrop-blur-xs" />
          <div className="relative bg-beige-light  h-screen px-6 pt-10   w-[300px] md:w-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl tracking-widest font-semibold">Filter</h3>
              <button onClick={() => setShowFilters(false)}>
                <MdClose className="text-2xl font-semibold" />
              </button>
            </div>
            <div>
              <button
                onClick={() => SetShowAvaiabilityFilters((prev) => !prev)}
                className={`flex gap-1 items-center text-xl tracking-wider ${
                  showAvaiabilityFilters ? 'mb-2' : 'mb-6'
                } mt-8`}
              >
                Availabilty
                {showAvaiabilityFilters ? (
                  <HiOutlineMinusSm className="text-lg" />
                ) : (
                  <HiOutlinePlusSm className="text-lg" />
                )}
              </button>
              {showAvaiabilityFilters && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      onClick={() => {
                        if (filters.available === 'available') {
                          setFilters((filters) => ({
                            ...filters,
                            available: '',
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            available: 'available',
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.available === 'available'
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.available === 'available' && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>In Stock</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => {
                        if (filters.available === 'not-available') {
                          setFilters((filters) => ({
                            ...filters,
                            available: '',
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            available: 'not-available',
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.available === 'not-available'
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.available === 'not-available' && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>Sold Out</p>
                  </div>
                </>
              )}
            </div>
            <div>
              <button
                onClick={() => SetShowSizeFilters((prev) => !prev)}
                className={`flex gap-1 items-center text-xl tracking-wider ${
                  showSizeFilters ? 'mb-2' : 'mb-6'
                } mt-8`}
              >
                Size <HiOutlinePlusSm className="text-lg" />{' '}
              </button>
              {showSizeFilters && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      onClick={() => {
                        if (filters.size === '1824') {
                          setFilters((filters) => ({
                            ...filters,
                            size: '',
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            size: '1824',
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.size === '1824'
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.size === '1824' && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>18 x 24</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      onClick={() => {
                        if (filters.size === '2436') {
                          setFilters((filters) => ({
                            ...filters,
                            size: '',
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            size: '2436',
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.size === '2436'
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.size === '2436' && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>24 x 36</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => {
                        if (filters.size === '3648') {
                          setFilters((filters) => ({
                            ...filters,
                            size: '',
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            size: '3648',
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.size === '3648'
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.size === '3648' && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>36 x 48</p>
                  </div>
                </>
              )}
            </div>
            <div>
              <button
                onClick={() => SetShowPriceFilters((prev) => !prev)}
                className={`flex gap-1 items-center text-xl tracking-wider ${
                  showPriceFilters ? 'mb-2' : 'mb-6'
                } mt-8`}
              >
                Price <HiOutlinePlusSm className="text-lg" />{' '}
              </button>
              {showPriceFilters && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      onClick={() => {
                        if (filters.maxPrice === 1000) {
                          setFilters((filters) => ({
                            ...filters,
                            maxPrice: 10000,
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            maxPrice: 1000,
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.maxPrice <= 1000
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.maxPrice <= 1000 && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>up to $1000</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      onClick={() => {
                        if (filters.maxPrice === 2000) {
                          setFilters((filters) => ({
                            ...filters,
                            maxPrice: 10000,
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            maxPrice: 2000,
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.maxPrice <= 2000 && filters.maxPrice > 1000
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.maxPrice <= 2000 && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>up to $2000</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => {
                        if (filters.maxPrice === 3000) {
                          setFilters((filters) => ({
                            ...filters,
                            maxPrice: 10000,
                          }));
                        } else {
                          setFilters((filters) => ({
                            ...filters,
                            maxPrice: 3000,
                          }));
                        }
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        filters.maxPrice <= 3000 && filters.maxPrice > 2000
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-gray-300 group-hover:border-brand'
                      }`}
                    >
                      {filters.size <= 3000 && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <p>up to $3000</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersMobileModal;
