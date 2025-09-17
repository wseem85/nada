import React, { useState, useRef, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SectionTitle from '../components/SectionTitle';
// import { assets } from '../assets/assets';
import {
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { AuthContext } from '../contexts/contexts';
import { useNavigate } from 'react-router-dom';
import MyProfileSkeleton from '../skeletons/MyProfileSkeleton';
import axios from 'axios';
import NadaHelmet from '../components/NadaHelmet';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, isLoadingUser, checkAuth } = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Configure axios for this component
  axios.defaults.withCredentials = true;

  // Only keep editForm for collecting form data during editing
  const [editForm, setEditForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    password: '',
    passwordConfirm: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const fileInputRef = useRef(null);

  // Initialize editForm when user data is available
  useEffect(() => {
    console.log('MyProfile Debug:', {
      user,
      isLoadingUser,
      userKeys: user ? Object.keys(user) : 'no user',
    });

    if (user && !isLoadingUser) {
      console.log('Setting editForm with user data:', user);
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || user.adress || '', // handle both spellings
        bio: user.bio || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        gender: user.gender || 'Male',
      });
    }
  }, [user, isLoadingUser]);

  useEffect(() => {
    if (isLoadingUser) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, isLoadingUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append form fields
      Object.keys(editForm).forEach((key) => {
        if (editForm[key] !== '') {
          formData.append(key, editForm[key]);
        }
      });

      // Append image if selected
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }

      const response = await axios.patch(
        backendUrl + '/api/users/update-me',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.data.status === 'success') {
        setIsEditing(false);
        setSelectedImage(null);
        toast.success('Profile updated successfully!');

        // Refresh user data in context
        await checkAuth();
      }
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !passwordForm.currentPassword ||
      !passwordForm.password ||
      !passwordForm.passwordConfirm
    ) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.password !== passwordForm.passwordConfirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.patch(
        backendUrl + '/api/users/update-password',
        {
          currentPassword: passwordForm.currentPassword,
          password: passwordForm.password,
          passwordConfirm: passwordForm.passwordConfirm,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.status === 'success') {
        // Reset form and close modal
        setPasswordForm({
          currentPassword: '',
          password: '',
          passwordConfirm: '',
        });
        setIsChangingPassword(false);
        toast.success('Password updated successfully!');
      }
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset editForm to current user data
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || user.adress || '',
      bio: user.bio || '',
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
      gender: user.gender || 'Male',
    });
    setSelectedImage(null);
    setIsEditing(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  if (isLoadingUser) {
    return <MyProfileSkeleton />;
  }

  if (!user || isLoadingUser) {
    return <MyProfileSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <NadaHelmet
        sections={['Me', 'My Profile']}
        description="Manage your Nada Art profile, view your art collection, track orders, update preferences, and manage your artist portfolio and account settings."
        keywords="nada art profile, artist profile, art collector account, my artwork collection, order history, account settings, art preferences, portfolio management, artist dashboard, profile update"
      />
      {/* Header Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-12"
      >
        <SectionTitle title="My Profile" />
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Manage your account information and preferences
        </motion.p>
      </motion.section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige sticky top-4">
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {isEditing ? (
                  <label>
                    <div className="inline-block cursor-pointer relative min-h-[150px] min-w-[150px]">
                      <img
                        src={
                          selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : user.photo !== ''
                            ? user.photo
                            : '../../src/assets/profile_default_pic.png'
                        }
                        alt="Profile"
                        className="w-36 h-full object-cover opacity-50"
                      />
                      <img
                        className="absolute bottom-12 right-12"
                        src={
                          selectedImage
                            ? ''
                            : '../../src/assets/upload_icon.gif'
                        }
                        alt=""
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setSelectedImage(e.target.files[0]);
                          handleImageChange(e);
                        }}
                        className="hidden"
                      />
                    </div>
                  </label>
                ) : (
                  <div className="min-h-[150px] min-w-[150px]">
                    <img
                      className="w-36 rounded"
                      src={
                        user.photo !== ''
                          ? user.photo
                          : `../../src/assets/profile_default_pic.png`
                      }
                      alt="User Avatar"
                    />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-caveat text-brand-dark mt-4 mb-2">
                {isEditing ? editForm.name : user.name}
              </h2>
              <p className="text-gray-600">Art Enthusiast</p>
            </div>

            {/* Edit Buttons */}
            <div className="space-y-2">
              {!isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FiLock className="w-4 h-4" />
                    Change Password
                  </motion.button>
                </>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-brand hover:bg-brand-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
            <p className="text-xl mb-6 font-medium">Personal Information</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <FiUser className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                  />
                ) : (
                  <p className="px-4 py-3 bg-beige-light rounded-lg text-text">
                    {user.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <FiMail className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                  />
                ) : (
                  <p className="px-4 py-3 bg-beige-light rounded-lg text-text">
                    {user.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <FiPhone className="inline w-4 h-4 mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                  />
                ) : (
                  <p className="px-4 py-3 bg-beige-light rounded-lg text-text">
                    {user.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-2" />
                  Member Since
                </label>
                <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                  {new Date(user.dateJoined).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text mb-2">
                  <FiMapPin className="inline w-4 h-4 mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                  />
                ) : (
                  <p className="px-4 py-3 bg-beige-light rounded-lg text-text">
                    {user.address}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <FiCalendar className="inline w-4 h-4 mr-2" />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editForm.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                />
              ) : (
                <p className="px-4 py-3 bg-beige-light rounded-lg text-text">
                  {user.dob
                    ? new Date(user.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Not set'}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <FiUser className="inline w-4 h-4 mr-2" />
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-beige-light rounded-lg text-text">
                  {user.gender || 'Not set'}
                </p>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
            <p className="text-xl mb-6 font-medium">About Me</p>
            {isEditing ? (
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 bg-beige-light resize-vertical"
                placeholder="Tell us about yourself and your art interests..."
              />
            ) : (
              <p className="text-text leading-relaxed bg-beige-light rounded-lg p-4">
                {user.bio || 'No bio available.'}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-6">
                Change Password
              </h3>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand"
                    >
                      {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="password"
                      value={passwordForm.password}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 pr-12"
                      required
                      minLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand"
                    >
                      {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="passwordConfirm"
                      value={passwordForm.passwordConfirm}
                      onChange={handlePasswordInputChange}
                      className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200 pr-12"
                      required
                      minLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand"
                    >
                      {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-brand hover:bg-brand-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiLock className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        currentPassword: '',
                        password: '',
                        passwordConfirm: '',
                      });
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Activity Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12"
      >
        <p className="text-2xl mb-6 text-center">Recent Activity</p>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-beige-light rounded-lg">
              <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                <FiShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-text">
                  Purchased "Abstract Dreams #5"
                </p>
                <p className="text-sm text-gray-600">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-beige-light rounded-lg">
              <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-text">
                  Added "Portrait Study" to favorites
                </p>
                <p className="text-sm text-gray-600">1 week ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-beige-light rounded-lg">
              <div className="w-12 h-12 bg-beige-dark rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-text">
                  Updated profile information
                </p>
                <p className="text-sm text-gray-600">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default MyProfile;
