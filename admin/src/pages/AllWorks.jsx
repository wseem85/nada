import React, { useMemo, useState } from 'react';
// import { artworks } from '../assets/artworks';
import ArtworkLine from '../components/ArtworkLine';
import EditArtworkModal from '../components/EditArtworkModal';
import DeleteArtworkModal from '../components/DeleteArtworkModal';
import { useContext } from 'react';
import { AppContext } from '../contexts/contexts';
import { useEffect } from 'react';
import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler';
import AllWorksSkeleton from '../skeletons/AllWorksSkeleton';
import RestoreArtworkModel from '../components/RestoreArtworkModel';
const AllWorks = () => {
  const {
    backendUrl,
    artworks,
    errorGettingArtworks,
    loadingArtworks,
    fetchArtworks,
  } = useContext(AppContext);

  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  // const[artworks,setArtworks]=useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(artworks.length / pageSize));
  const pagedArtworks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return artworks.slice(start, start + pageSize);
  }, [artworks, currentPage, pageSize]);

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
      <h3 className="text-2xl font-bold text-center mb-6">All Artworks</h3>
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

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6 mb-4">
        <button
          onClick={() => {
            setCurrentPage((p) => Math.max(1, p - 1)), scrollTo(0, 0);
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
