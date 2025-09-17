import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiMail, FiLock, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { AdminContext } from '../contexts/contexts';
import FullScreenSpinner from '../components/FullScreenSpinner';

const Login = () => {
  const { login, admin, isLoadingAdmin, isLoggingAdmin, errorLogin } =
    useContext(AdminContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrorMessage('');

    await login(formData);
  };
  useEffect(() => {
    if (admin && admin.role === 'admin') {
      navigate('/dashboard');
    }
  }, [admin, navigate]);
  // Show loading spinner while checking authentication
  if (isLoadingAdmin || isLoggingAdmin) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7ecec] via-beige-light to-[#faf7f0] flex items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Logo />
          <motion.p
            variants={itemVariants}
            className="text-text/70 mt-2 font-light"
          >
            Admin Portal - Manage Your Art Gallery
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-beige/30"
        >
          <div className="mb-6">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center mb-4"
            >
              <FiShield className="text-brand text-3xl mr-3" />
              <h2 className="text-2xl font-caveat text-brand">Admin Access</h2>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-text/60 text-center text-sm"
            >
              Sign in to access the admin dashboard
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand/60" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Admin Email"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white/70 ${
                  errors.email ? 'border-red-400' : 'border-beige'
                }`}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Admin Password"
                className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white/70 ${
                  errors.password ? 'border-red-400' : 'border-beige'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand/60 hover:text-brand transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p className="text-red-600 text-sm text-center">
                  {errorMessage}
                </p>
              </motion.div>
            )}

            {errorLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p className="text-red-600 text-sm text-center">{errorLogin}</p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoggingAdmin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all duration-200 ${
                isLoggingAdmin
                  ? 'bg-brand/50 cursor-not-allowed'
                  : 'bg-brand hover:bg-brand-dark active:bg-brand-dark'
              } focus:outline-none focus:ring-2 focus:ring-brand/30`}
            >
              {isLoggingAdmin ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing In...
                </div>
              ) : (
                'Sign In to Admin Panel'
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            variants={itemVariants}
            className="mt-6 pt-6 border-t border-beige text-center"
          >
            <div className="bg-beige-light/50 rounded-lg p-4 mb-4">
              <p className="text-text/70 text-sm font-medium mb-2">
                Demo Credentials:
              </p>
              <p className="text-text/60 text-xs">
                Email: admin@gmail.com
                <br />
                Password: pass1234
              </p>
            </div>
            <p className="text-text/50 text-xs">
              Secure admin access to manage your art gallery
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 text-text/50 text-xs"
        >
          © 2024 NadaArt Admin Portal. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
