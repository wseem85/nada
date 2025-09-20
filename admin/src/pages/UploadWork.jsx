import React, { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { AdminContext, AppContext } from '../contexts/contexts';
import axios from 'axios';
import {
  FiUpload,
  FiX,
  FiImage,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiSave,
  FiEye,
} from 'react-icons/fi';
import { getErrorMessage } from '../utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UploadWork = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AdminContext);
  const { setArtworksChanges } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    width: '',
    height: '',
    price: '',
    discount: '',
    availability: true,
    description: '',
    categories: '',
    images: [],
  });

  // Image preview states
  const [imagePreviews, setImagePreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Form validation
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.title ||
      formData.title.length < 10 ||
      formData.title.length > 40
    ) {
      newErrors.title = 'Title must be between 10-40 characters';
    }

    if (!formData.width || isNaN(formData.width) || formData.width <= 0) {
      newErrors.width = 'Width must be a positive number';
    }

    if (!formData.height || isNaN(formData.height) || formData.height <= 0) {
      newErrors.height = 'Height must be a positive number';
    }

    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (
      formData.discount &&
      (isNaN(formData.discount) ||
        formData.discount < 0 ||
        formData.discount > 100)
    ) {
      newErrors.discount = 'Discount must be between 0-100';
    }

    if (!formData.description || formData.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters';
    }

    if (!formData.categories.trim()) {
      newErrors.categories = 'At least one category is required';
    }

    if (formData.images.length !== 3) {
      newErrors.images = 'Exactly 3 images are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);

    if (formData.images.length + fileArray.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      categories: formData.categories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    };

    try {
      setIsLoading(true);
      const fd = new FormData();
      fd.append('data', JSON.stringify(payload));

      formData.images.forEach((file, index) => {
        fd.append('indices[]', String(index));
        fd.append('images[]', file);
      });

      const response = await axios.post(`${backendUrl}/api/artworks`, fd, {
        withCredentials: true,
      });
      console.log(response);
      if (response.data.status === 'success') {
        toast.success('Artwork uploaded successfully!');

        // Reset form
        setFormData({
          title: '',
          width: '',
          height: '',
          price: '',
          discount: '',
          availability: true,
          description: '',
          categories: '',
          images: [],
        });
        setImagePreviews([]);
        setErrors({});
        setArtworksChanges((prev) => !prev);
        console.log(
          `${backendUrl}/all-artworks/${response.data.data.data._id}`
        );
        navigate(`/all-artworks/${response.data.data.data._id}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    scrollTo(0, 0);
  });
  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl tracking-widest  text-brand">
            Upload New Artwork
          </h3>
          <p className="text-text/70 text-lg">
            Add a new piece to your gallery collection
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
        >
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-lg font-medium text-text">
              <FiImage className="text-brand" />
              Artwork Images (3 required)
            </label>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-brand bg-brand/5 scale-105'
                  : formData.images.length === 3
                  ? 'border-green-400 bg-green-50'
                  : 'border-beige hover:border-brand hover:bg-brand/5'
              }`}
            >
              <div className="space-y-4">
                <FiUpload
                  className={`mx-auto text-4xl ${
                    dragActive ? 'text-brand' : 'text-text/40'
                  }`}
                />
                <div>
                  <p className="text-lg font-medium text-text">
                    {formData.images.length === 3
                      ? 'All 3 images uploaded!'
                      : `Upload ${3 - formData.images.length} more image${
                          3 - formData.images.length !== 1 ? 's' : ''
                        }`}
                  </p>
                  <p className="text-sm text-text/60 mt-1">
                    Drag & drop or click to select (Max 5MB each)
                  </p>
                </div>
                {formData.images.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-brand text-white rounded-full hover:bg-brand-dark transition-colors duration-200"
                  >
                    Choose Files
                  </button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {errors.images && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <FiX className="text-xs" />
                {errors.images}
              </p>
            )}

            {/* Image Previews */}
            <AnimatePresence>
              {imagePreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group rounded-lg overflow-hidden bg-white shadow-md"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full transition-all duration-200 hover:bg-red-600"
                        >
                          <FiX />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 text-xs font-medium rounded">
                        Image {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
                <FiTag className="text-brand" />
                Artwork Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter artwork title (10-40 characters)"
                className={`w-full px-4 py-3 border rounded-xl bg-white/80 transition-all duration-200 focus:ring-2 focus:ring-brand/30 focus:border-brand ${
                  errors.title ? 'border-red-400' : 'border-beige'
                }`}
              />
              <div className="flex justify-between text-xs mt-1">
                {errors.title ? (
                  <span className="text-red-500">{errors.title}</span>
                ) : (
                  <span className="text-text/50">
                    Minimum 10 characters required
                  </span>
                )}
                <span
                  className={`${
                    formData.title.length > 40 ? 'text-red-500' : 'text-text/50'
                  }`}
                >
                  {formData.title.length}/40
                </span>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Width (inches) *
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                className={`w-full px-4 py-3 border rounded-xl bg-white/80 transition-all duration-200 focus:ring-2 focus:ring-brand/30 focus:border-brand ${
                  errors.width ? 'border-red-400' : 'border-beige'
                }`}
              />
              {errors.width && (
                <p className="text-red-500 text-xs mt-1">{errors.width}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Height (inches) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g., 70"
                className={`w-full px-4 py-3 border rounded-xl bg-white/80 transition-all duration-200 focus:ring-2 focus:ring-brand/30 focus:border-brand ${
                  errors.height ? 'border-red-400' : 'border-beige'
                }`}
              />
              {errors.height && (
                <p className="text-red-500 text-xs mt-1">{errors.height}</p>
              )}
            </div>

            {/* Pricing */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
                <FiDollarSign className="text-brand" />
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 299.99"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-xl bg-white/80 transition-all duration-200 focus:ring-2 focus:ring-brand/30 focus:border-brand ${
                  errors.price ? 'border-red-400' : 'border-beige'
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="e.g., 15"
                min="0"
                max="100"
                className={`w-full px-4 py-3 border rounded-xl bg-white/80 transition-all duration-200 focus:ring-2 focus:ring-brand/30 focus:border-brand ${
                  errors.discount ? 'border-red-400' : 'border-beige'
                }`}
              />
              {errors.discount && (
                <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Categories *{' '}
              <span className="text-text/50 text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              placeholder="e.g., Abstract, Modern, Oil Painting"
              className={`w-full px-4 py-3 border rounded-xl bg-white/80 transition-all duration-200 focus:ring-2 focus:ring-brand/30 focus:border-brand ${
                errors.categories ? 'border-red-400' : 'border-beige'
              }`}
            />
            {errors.categories && (
              <p className="text-red-500 text-xs mt-1">{errors.categories}</p>
            )}
            {formData.categories && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.categories.split(',').map((cat, index) => {
                  const trimmedCat = cat.trim();
                  return trimmedCat ? (
                    <span
                      key={index}
                      className="px-2 py-1 bg-brand/10 text-brand text-xs rounded-full"
                    >
                      {trimmedCat}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
                className="w-5 h-5 accent-brand rounded"
              />
              <span className="text-sm font-medium text-text">
                Available for purchase
              </span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
              <FiFileText className="text-brand" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your artwork in detail..."
              rows={6}
              className={`w-full px-4 py-3 border rounded-xl bg-white/80 transition-all duration-200 focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none ${
                errors.description ? 'border-red-400' : 'border-beige'
              }`}
            />
            <div className="flex justify-between text-xs mt-1">
              {errors.description ? (
                <span className="text-red-500">{errors.description}</span>
              ) : (
                <span className="text-text/50">
                  Minimum 100 characters required
                </span>
              )}
              <span
                className={`${
                  formData.description.length < 100
                    ? 'text-red-500'
                    : 'text-text/50'
                }`}
              >
                {formData.description.length}/100 minimum
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className=" w-full pt-6">
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`mx-auto md:ml-auto md:mr-0  px-6 py-4 bg-brand text-white rounded-xl hover:bg-brand-dark transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiSave />
                  Upload Artwork
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default UploadWork;
