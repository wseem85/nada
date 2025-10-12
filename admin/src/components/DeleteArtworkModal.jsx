import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../contexts/contexts';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Backdrop = ({ onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
  />
);

const ModalCard = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white/95 border border-beige rounded-2xl shadow-xl p-5">
      {children}
    </div>
  </div>
);

const DeleteArtworkModal = ({ open, artworkTitle, artworkId, onClose }) => {
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDeleting, setErrorDeleting] = useState('');
  const { backendUrl, setArtworksChanges } = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorDeleting('');
      setIsDeleting(true);
      console.log(artworkId);
      await axios.delete(backendUrl + `/api/artworks/${artworkId}`);
      onClose?.();
      setArtworksChanges((prev) => !prev);
      navigate(`/all-artworks/${artworkId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setErrorDeleting(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };
  if (!open) return null;
  return (
    <>
      <Backdrop onClose={onClose} />
      <ModalCard>
        <h3 className="text-lg font-semibold text-brand">Delete Artwork</h3>
        <p className="text-sm text-text/70 mt-2">
          Are you sure you want to delete "{artworkTitle}"? This action can be
          undone.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-beige text-text/70"
          >
            Cancel
          </button>
          <button
            disabled={isDeleting}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            {isDeleting ? 'Working on...' : 'Delete'}
          </button>
        </div>
      </ModalCard>
    </>
  );
};

export default DeleteArtworkModal;


