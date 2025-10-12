import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

import { getErrorMessage } from '../../utils/errorHandler';
import NadaHelmet from '../components/NadaHelmet';

const ResetPassword = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorResetingPassword, setErrorResettingPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: You could add a token validation check here
    setIsValidToken(true); // Assume token is valid for now
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setErrorResettingPassword('Passwords do not match');
      toast.error('Passwords do not match');
      setPassword('');
      setPasswordConfirm('');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setErrorResettingPassword('Password must be at least 8 characters long');
      setPassword('');
      setPasswordConfirm('');
      return;
    }

    setIsLoading(true);
    setErrorResettingPassword('');
    try {
      const { data } = await axios.patch(
        backendUrl + `/api/users/reset-password/${token}`,
        {
          password,
          passwordConfirm,
        }
      );

      if (data.status === 'success') {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
        setTimeout(() => {
          scrollTo(0, 0);
          navigate('/my-profile');
        }, 2000);
      } else {
        setErrorResettingPassword(data.message);
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setErrorResettingPassword(getErrorMessage(error));
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
        <NadaHelmet
          sections={['Reset Password']}
          description="Reset your Nada Art account password securely. Recover access to your art collection, profile, and exclusive member features with our password reset tool."
          keywords="nada art password reset, recover art account, forgot password art, reset login credentials, art account recovery, password change, secure account access, art profile recovery, reset artist password, gallery account access"
        />
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-caveat text-text mb-4">
            Invalid or Expired Link
          </h2>
          <p className="text-text opacity-70 mb-6">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">
            <FiCheckCircle className="mx-auto" />
          </div>
          <h2 className="text-2xl font-caveat text-text mb-4">
            Password Reset Successfully!
          </h2>
          <p className="text-text opacity-70 mb-6">
            Your password has been updated. Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-caveat text-text mb-2">
              Reset Password
            </h1>
            <p className="text-text opacity-70">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
                className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-text mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                minLength="8"
                className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-brand focus:outline-none transition-colors duration-200"
                placeholder="Confirm new password"
              />
            </div>
            {errorResetingPassword ? (
              <div className="text-red-400 test-md my-4">
                {errorResetingPassword}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={isLoading || !password || !passwordConfirm}
              className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <FiLock className="w-5 h-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
