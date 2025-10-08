import { useCallback, useState, useEffect } from 'react';
import { AdminContext } from './contexts.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler.js';
import { useNavigate } from 'react-router-dom';

const AdminContextProvider = (props) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [isLoggingAdmin, setIsLoggingAdmin] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true); // Initialize to true
  const [authenticationError, setAuthenticationError] = useState('');
  const [logoutError, setLogoutError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + '/api/admin');

      if (
        response.data.status === 'success' &&
        response.data.data.user.role === 'admin'
      ) {
        setAdmin(response.data.data.user);
      }
    } catch (error) {
      setAdmin(null);
      // Only show toast if this isn't the initial auth check
      if (admin !== null) {
        toast.warning(
          'You need to login using admin credentials in order to access dashboard'
        );
      }
      setAuthenticationError(getErrorMessage(error));
    } finally {
      setIsLoadingAdmin(false);
    }
  }, [backendUrl, admin]);

  useEffect(() => {
    checkAuth();
  }, []); // Remove checkAuth from dependencies to avoid unnecessary re-runs

  const login = async ({ email, password }) => {
    try {
      setIsLoggingAdmin(true);
      const response = await axios.post(
        backendUrl + '/api/admin/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        setAdmin(response.data.data.user);
        toast.success('Welcome back, Admin!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
      setErrorLogin(getErrorMessage(error));
    } finally {
      setIsLoggingAdmin(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.get(backendUrl + '/api/admin/logout', {
        withCredentials: true,
      });
      toast.success('Admin logout successfully');
      setAdmin(null);
      navigate('/login');
    } catch (e) {
      console.log(e);
      toast.error(getErrorMessage(e));
      setLogoutError(getErrorMessage(e));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const value = {
    backendUrl,
    admin,
    isLoadingAdmin,
    login,
    isLoggingAdmin,
    errorLogin,
    logout,
    authenticationError,
    isLoggingOut,
    logoutError,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
