import { useCallback, useState } from 'react';
import { AuthContext } from './contexts.js';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler.js';
const AuthContextProvider = (props) => {
  const [user, setUser] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;
  const checkAuth = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/users/me');

      if (response.data.status === 'success') {
        setUser(response.data.data.user);
      }
    } catch (error) {
      setUser(false);
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  const login = async function ({ email, password }) {
    try {
      const { data } = await axios.post(backendUrl + '/api/users/login', {
        email,
        password,
      });
      if (data.status === 'success') {
        setUser(data.data.user);
        return { success: true, user: data.data.user };
      }
    } catch (err) {
      console.log(err);
      throw new Error(getErrorMessage(err));
    }
  };
  const signup = async function ({ email, password, passwordConfirm, name }) {
    try {
      const response = await axios.post(backendUrl + '/api/users/signup', {
        name,
        email,
        password,
        passwordConfirm,
      });

      if (response.data.status === 'success') {
        console.log(response);
        setUser(response.data.data.user);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      console.log(err);
      throw new Error(getErrorMessage(err));
    }
  };
  const logout = async () => {
    try {
      const result = await axios.get(backendUrl + '/api/users/logout');
      if (result.data.status === 'success') {
        setUser(false);
        setIsLoadingUser(false);
      }
    } catch (err) {
      console.log(err);
      throw new Error(getErrorMessage(err));
    } finally {
      setUser(false);
      setIsLoadingUser(false);
    }
  };
  const forgotPassword = async function (email) {
    try {
      const result = await axios.post(
        backendUrl + '/api/users/forgot-password',
        { email }
      );

      if (result.data.status === 'success') {
        return result;
      }
    } catch (err) {
      if (err.message === 'Network Error') {
        throw new Error(
          `${err.message}: Please Check your connection and try again `
        );
      } else {
        throw err;
      }
    } finally {
      // setUser(false);
      // setIsLoadingUser(false);
    }
  };
  const value = {
    login,
    signup,
    logout,
    user,
    isLoadingUser,
    checkAuth,
    setUser,
    forgotPassword,
  };

  // useEffect(
  //   function () {
  //     if (token) getUserData();
  //     else setUserData(false);
  //   },
  //   [token, getUserData]
  // );
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
export default AuthContextProvider;
