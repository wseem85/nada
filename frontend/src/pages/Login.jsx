import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { AuthContext } from '../contexts/contexts';
import SectionTitle from '../components/SectionTitle';
import Logo from '../components/Logo';
import { getErrorMessage } from '../../utils/errorHandler';
import { toast } from 'react-toastify';

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMail, setForgotPasswordMail] = useState('');
  const [errorForgotPasswordMail, setErrorForgotPasswordMail] = useState('');
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: 'test',
    email: 'test@test.com',
    password: '12345678',
    passwordConfirm: '12345678',
  });
  const [errors, setErrors] = useState({});
  const [isSigning, setIsSigning] = useState(false);
  const [isLogining, setIsLogining] = useState(false);

  const [errorLogining, setErrorLogining] = useState('');
  const [errorSigning, setErrorSigning] = useState('');

  const { login, signup, user, checkAuth, forgotPassword } =
    useContext(AuthContext);

  const navigate = useNavigate();
  // const { login, register } = useContext(AuthContext);

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin && formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // setIsLoading(true);
    let result;
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isLogin) {
        // Handle login

        try {
          setIsLogining(true);
          result = await login(formData);
        } catch (err) {
          console.log(err);
          setErrorLogining(err.message);
        } finally {
          setIsLogining(false);
        }
        // await login(formData.email, formData.password);
      } else {
        // Handle registration

        try {
          setIsSigning(true);
          result = await signup(formData);
        } catch (err) {
          console.log(err);
          setErrorSigning(err.message);
        } finally {
          setIsSigning(false);
        }
      }

      if (result.success) {
        // Redirect immediately on success
        navigate('/my-profile');
      }
      // Navigate to home or dashboard on success
      // navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    });
    setErrors({});
    setErrorLogining('');
    setErrorSigning('');
  };
  const handleForgotPassword = async function (e) {
    e.preventDefault();

    if (!forgotPasswordMail) {
      console.log('run');
      setErrorForgotPasswordMail('Please Provide Your Mail Address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotPasswordMail)) {
      setErrorForgotPasswordMail('Email format is invalid');
      return;
    }
    if (forgotPasswordMail && /\S+@\S+\.\S+/.test(forgotPasswordMail)) {
      setErrorForgotPasswordMail('');
    }
    try {
      setIsSendingResetEmail(true);

      const response = await forgotPassword(forgotPasswordMail);

      if (response?.data?.status === 'success') {
        toast.success('Check Youe Email Address');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message);
      setErrorForgotPasswordMail(err.message);
      setForgotPasswordMail('');
    } finally {
      setIsSendingResetEmail(false);
    }
  };
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
            {isLogin
              ? 'Welcome back to your artistic journey'
              : 'Begin your artistic adventure'}
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-beige/30"
        >
          <div className="mb-6">
            <SectionTitle
              title={isLogin ? 'Sign In' : 'Create Account'}
              interval={15000}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand/60" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white/70 ${
                        errors.name ? 'border-red-400' : 'border-beige'
                      }`}
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand/60" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
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
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
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
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand/60" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white/70 ${
                        errors.passwordConfirm
                          ? 'border-red-400'
                          : 'border-beige'
                      }`}
                    />
                    {errors.passwordConfirm && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.passwordConfirm}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {isLogin && (
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPasswordForm((prev) => !prev);
                  }}
                  className="text-brand hover:text-brand-dark transition-colors text-sm font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <div className="py-1">
              {showForgotPasswordForm && (
                <div className="">
                  <p className="mb-3">Please Provide Your mail address</p>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-3"
                  >
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand/60" />
                      <input
                        type="email"
                        name="forgotPassword"
                        value={forgotPasswordMail}
                        onChange={(e) => {
                          setForgotPasswordMail(e.target.value);
                        }}
                        placeholder="Provide Mail Address"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white/70 ${
                          errorForgotPasswordMail
                            ? 'border-red-400'
                            : 'border-beige'
                        }`}
                      />
                    </div>
                    {errorForgotPasswordMail && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errorForgotPasswordMail}
                      </motion.p>
                    )}
                    <div className="text-center my-2">
                      <button
                        disabled={isSendingResetEmail}
                        onClick={(e) => handleForgotPassword(e)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-1.5 px-3 rounded-md text-sm text-white bg-beige-dark transition-all duration-200 ${
                          isSendingResetEmail
                            ? ' cursor-not-allowed opacity-50'
                            : ''
                        } focus:outline-none focus:ring-2 focus:ring-brand/30`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {isSendingResetEmail && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                          )}

                          {isSendingResetEmail
                            ? 'Sending Mail...'
                            : '  Continue To Reset Password'}
                        </div>
                      </button>
                    </div>
                    <hr className="outline-none border-none bg-beige h-[1px] " />
                  </motion.div>
                </div>
              )}
            </div>
            {errorSigning && (
              <p className="text-red-400 text-sm my-3">{errorSigning}</p>
            )}

            {errorLogining && (
              <p className="text-red-400 text-sm m3-2">{errorLogining}</p>
            )}

            <motion.button
              type="submit"
              disabled={isSigning || isLogining}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all duration-200 ${
                isSigning || isLogining
                  ? 'bg-brand/50 cursor-not-allowed'
                  : 'bg-brand hover:bg-brand-dark active:bg-brand-dark'
              } focus:outline-none focus:ring-2 focus:ring-brand/30`}
            >
              {isSigning || isLogining ? (
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
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : isLogin ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <motion.div
            variants={itemVariants}
            className="mt-6 pt-6 border-t border-beige text-center"
          >
            <p className="text-text/70 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                disabled={isSigning || isLogining}
                onClick={toggleMode}
                className={`ml-2 text-brand hover:text-brand-dark font-medium transition-colors disabled:opacity-45`}
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4 text-center">
            <NavLink
              onClick={() => scrollTo(0, 0)}
              to="/"
              className="text-beige-dark hover:text-brand transition-colors text-sm font-medium"
            >
              ← Continue as Guest
            </NavLink>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 text-text/50 text-xs"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
