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

const RestoreArtworkModel = ({ open, artworkTitle, artworkId, onClose }) => {
  const navigate = useNavigate();

  const [isRestoring, setIsRestoring] = useState(false);
  const [errorRestoring, setErrorRestoring] = useState('');
  const { backendUrl } = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorRestoring('');
      setIsRestoring(true);
      console.log(artworkId);
      await axios.patch(backendUrl + `/api/artworks/${artworkId}/restore`, {
        deleted: false,
      });
      onClose?.();
      navigate('/all-artworks');
    } catch (err) {
      toast.error(getErrorMessage(err));
      setErrorRestoring(getErrorMessage(err));
    } finally {
      setIsRestoring(false);
    }
  };
  if (!open) return null;
  return (
    <>
      <Backdrop onClose={onClose} />
      <ModalCard>
        <h3 className="text-lg font-semibold text-brand">Restore Artwork</h3>
        <p className="text-sm text-text/70 mt-2">
          Are you sure you want to Restore "{artworkTitle}"? This will make it
          visible on the store
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-beige text-text/70"
          >
            Cancel
          </button>
          <button
            disabled={isRestoring}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRestoring ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            {isRestoring ? 'Working on...' : 'Restore'}
          </button>
        </div>
      </ModalCard>
    </>
  );
};

export default RestoreArtworkModel;
