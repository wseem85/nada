import React, { useMemo, useState } from 'react';
// import { artworks } from '../assets/artworks';
import ArtworkLine from '../components/ArtworkLine';
import EditArtworkModal from '../components/EditArtworkModal';
import DeleteArtworkModal from '../components/DeleteArtworkModal';
import { useContext } from 'react';
import { AppContext } from '../contexts/contexts';

import AllWorksSkeleton from '../skeletons/AllWorksSkeleton';
import RestoreArtworkModel from '../components/RestoreArtworkModel';
import { useEffect } from 'react';

const AllWorks = () => {
  const { artworks, errorGettingArtworks, loadingArtworks, fetchArtworks } =
    useContext(AppContext);

  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletedFilter, setDeletedFilter] = useState('all'); // 'all', 'deleted', 'active'
  const [availableFilter, setAvailableFilter] = useState('all'); // 'all', 'available', 'sold'

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter artworks based on search query and filters
  const filteredArtworks = useMemo(() => {
    let filtered = artworks;

    // Apply deleted filter
    if (deletedFilter === 'deleted') {
      filtered = filtered.filter((artwork) => artwork.deleted === true);
    } else if (deletedFilter === 'active') {
      filtered = filtered.filter((artwork) => artwork.deleted === false);
    }

    // Apply available filter
    if (availableFilter === 'available') {
      filtered = filtered.filter((artwork) => artwork.available === true);
    } else if (availableFilter === 'sold') {
      filtered = filtered.filter((artwork) => artwork.available === false);
    }

    // Apply search filter (only if query has 2+ characters)
    if (searchQuery.length >= 2) {
      filtered = filtered.filter((artwork) =>
        artwork.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [artworks, searchQuery, deletedFilter, availableFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredArtworks.length / pageSize));
  const pagedArtworks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArtworks.slice(start, start + pageSize);
  }, [filteredArtworks, currentPage, pageSize]);

  const handleEdit = (artwork) => {
    setSelectedArtwork(artwork);
    setShowEdit(true);
  };

  const handleDelete = (artwork) => {
    setSelectedArtwork(artwork);
    setShowDelete(true);
  };

  const handleRestore = (artwork) => {
    setSelectedArtwork(artwork);
    setShowRestore(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    // Reset to first page when filters change
    setCurrentPage(1);
  };
  useEffect(() => {
    scrollTo(0, 0);
  });
  if (loadingArtworks) {
    return <AllWorksSkeleton />;
  }

  if (errorGettingArtworks) {
    return (
      <div className="px-6 py-6 min-h-screen flex flex-col gap-4 justify-center items-center">
        <p className="text-2xl uppercase text-gray-500 tracking-wider">
          Something Went Wrong!
        </p>
        <p className="text-sm text-red-400 ">Error: {errorGettingArtworks}</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <h3 className="text-2xl tracking-widest text-center mb-4  text-brand">
        All Artworks
      </h3>

      {/* Filters Section */}
      <div className="mb-6 max-w-4xl mx-auto">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search artworks by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="text-sm text-gray-500 mt-1">
              Type at least 2 characters to search
            </p>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={deletedFilter}
              onChange={(e) => {
                setDeletedFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-3 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            >
              <option value="all">All Artworks</option>
              <option value="active">Active Artworks</option>
              <option value="deleted">Deleted Artworks</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={availableFilter}
              onChange={(e) => {
                setAvailableFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-3 py-2 border border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="available">In Stock</option>
              <option value="sold">Sold Out</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Showing {filteredArtworks.length} of {artworks.length} artwork
            {filteredArtworks.length !== 1 ? 's' : ''}
            {searchQuery.length >= 2 && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>

      <div className="">
        {pagedArtworks.map((item) => (
          <ArtworkLine
            key={item.id}
            artwork={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
            onRestore={() => handleRestore(item)}
          />
        ))}
      </div>

      {filteredArtworks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchQuery.length >= 2
              ? `No artworks found matching "${searchQuery}"`
              : 'No artworks match the selected filters'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredArtworks.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              scrollTo(0, 0);
            }}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg border border-beige ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-beige-light'
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  scrollTo(0, 0);
                }}
                className={`px-3 py-1.5 rounded-lg border ${
                  page === currentPage
                    ? 'bg-brand text-white border-brand'
                    : 'border-beige hover:bg-beige-light'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              scrollTo(0, 0);
            }}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg border border-beige ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-beige-light'
            }`}
          >
            Next
          </button>
        </div>
      )}

      <EditArtworkModal
        open={showEdit}
        artwork={selectedArtwork}
        onClose={() => setShowEdit(false)}
      />
      <DeleteArtworkModal
        open={showDelete}
        artworkTitle={selectedArtwork?.title}
        artworkId={selectedArtwork?._id}
        onClose={async () => {
          setShowDelete(false);
          await fetchArtworks();
        }}
      />
      <RestoreArtworkModel
        open={showRestore}
        artworkTitle={selectedArtwork?.title}
        artworkId={selectedArtwork?._id}
        onClose={async () => {
          setShowRestore(false);
          await fetchArtworks();
        }}
      />
    </div>
  );
};

export default AllWorks;
