import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/contexts';
import { getErrorMessage } from '../utils/errorHandler';
import { toast } from 'react-toastify';

const Backdrop = ({ onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
  />
);

const ModalCard = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="w-full max-w-2xl bg-beige-light text-text border border-beige rounded-2xl shadow-xl p-5 overflow-y-auto max-h-[85vh]">
      {children}
    </div>
  </div>
);

const EditArtworkModal = ({ open, artwork, onClose, onSave }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [imageReplacements, setImageReplacements] = useState({
    0: null,
    1: null,
    2: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorEditing, setErrorEditing] = useState('');
  const { backendUrl } = useContext(AppContext);
  useEffect(() => {
    if (open && artwork) {
      setForm({
        title: artwork.title || '',
        price: artwork.price || 0,
        discount: artwork.discount || 0,
        width: artwork.width || '',
        height: artwork.height || '',
        categories: artwork.categories?.join(', ') || '',
        available: Boolean(artwork.available),
        description: artwork.description || '',
      });
      setImageReplacements({ 0: null, 1: null, 2: null });
    }
  }, [open, artwork]);

  if (!open || !form) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      categories: form.categories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    };
    const imagesUpdates = Object.entries(imageReplacements)
      .filter(([, file]) => Boolean(file))
      .map(([index, file]) => ({ index: Number(index), file }));

    const hasImageUpdates = imagesUpdates.length > 0;

    try {
      setErrorEditing('');
      setIsEditing(true);
      let response;
      if (!hasImageUpdates) {
        // No image changes: send JSON only
        response = await axios.patch(
          backendUrl + `/api/artworks/${artwork._id}`,
          payload
        );
      } else {
        // With image changes: send multipart preserving indices
        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        imagesUpdates.forEach(({ index, file }) => {
          formData.append('indices[]', String(index));
          formData.append('images[]', file);
        });

        response = await axios.patch(
          backendUrl + `/api/artworks/${artwork._id}`,
          formData
          // Let axios automatically set Content-Type with boundary
        );
      }

      if (response.status === 204 && response.statusText === 'No Content') {
        toast(
          'You trying to update artwork with the exact same data exsists right now. Make somwething different!'
        );
      } else toast.success('Artwork updated successfully!');
      onClose?.();
      navigate('/all-artworks/:workId'.replace(':workId', artwork._id));
    } catch (err) {
      console.log(err);

      toast.error(getErrorMessage(err));
      setErrorEditing(getErrorMessage(err));
    } finally {
      setIsEditing(false);
    }

    // onSave?.(payload);
    // onClose?.();
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <ModalCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-brand">Edit Artwork</h3>
          <button onClick={onClose} className="text-text/60 hover:text-text">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Optional image replacements (preserve index positions) */}
          <div className="space-y-2">
            <p className="text-sm text-text/70">
              Images (optional – keeps index positions)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="border border-beige rounded-lg p-3 bg-white/70"
                >
                  <p className="text-xs text-text/60 mb-2">Image #{idx + 1}</p>
                  <div className="aspect-[4/3] w-full rounded-md overflow-hidden border border-beige/60 bg-beige/30 mb-2">
                    {imageReplacements[idx] ? (
                      <img
                        src={URL.createObjectURL(imageReplacements[idx])}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      artwork?.images?.[idx] && (
                        <img
                          src={artwork.images[idx]}
                          alt={`current-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      )
                    )}
                  </div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageReplacements((prev) => ({
                          ...prev,
                          [idx]: file,
                        }));
                      }}
                      className="block w-full text-xs text-text/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-dark"
                    />
                  </label>
                  {imageReplacements[idx] && (
                    <button
                      type="button"
                      onClick={() =>
                        setImageReplacements((prev) => ({
                          ...prev,
                          [idx]: null,
                        }))
                      }
                      className="mt-2 text-xs text-red-600 hover:underline"
                    >
                      Remove replacement
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text/70 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-beige bg-white/80"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-text/70 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-beige bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm text-text/70 mb-1">
                Discount %
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-beige bg-white/80"
              />
            </div>
            <div className="flex items-end gap-2">
              <input
                id="available"
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="h-5 w-5 accent-brand"
              />
              <label htmlFor="available" className="text-sm text-text/70">
                Available
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text/70 mb-1">Width</label>
              <input
                name="width"
                value={form.width}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-beige bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm text-text/70 mb-1">Height</label>
              <input
                name="height"
                value={form.height}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-beige bg-white/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text/70 mb-1">
              Categories (comma separated)
            </label>
            <input
              name="categories"
              value={form.categories}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-beige bg-white/80"
            />
          </div>

          <div>
            <label className="block text-sm text-text/70 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-beige bg-white/80"
            />
          </div>
          {errorEditing ? (
            <div className="my-3 bg-red-200">
              <p className="text-red-500 text-center py-3 ">{errorEditing}</p>
            </div>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-beige text-text/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEditing}
              className={`px-4 py-2 flex gap-2 items-center rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isEditing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : null}
              {isEditing ? 'Working on...' : 'Save'}
            </button>
          </div>
        </form>
      </ModalCard>
    </>
  );
};

export default EditArtworkModal;
