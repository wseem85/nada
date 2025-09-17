import { useCallback, useEffect, useState } from 'react';
import { AppContext } from './contexts.js';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../utils/errorHandler.js';
import axios from 'axios';

const AppContextProvider = (props) => {
  const worksPerPage = 6;
  const [artworks, setArtworks] = useState([]);
  const [serverConnected, setServerConnected] = useState(false);
  const [errorGettingArtworks, setErrorGettingArtworks] = useState('');
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  // const [userData, setUserData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchArtworks = useCallback(async () => {
    try {
      setErrorGettingArtworks('');
      setLoadingArtworks(true);
      const response = await axios.get(
        backendUrl + `/api/artworks/admin/artworks`
      );
      if (response.data.status === 'success') {
        setArtworks(response.data.data.data);
      }
    } catch (err) {
      console.log(err);
      // toast.error(getErrorMessage(err));
      setErrorGettingArtworks(getErrorMessage(err));
    } finally {
      setLoadingArtworks(false);
    }
  }, [backendUrl]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(backendUrl + '/');
        setServerConnected(true);
      } catch (err) {
        setServerConnected(false);
      }
      await fetchArtworks();
    };
    fetchData();
  }, [fetchArtworks, backendUrl]);
  const value = {
    backendUrl,
    artworks,
    errorGettingArtworks,
    loadingArtworks,
    fetchArtworks,
    serverConnected,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
