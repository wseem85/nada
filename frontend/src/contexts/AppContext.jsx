import { useCallback, useState } from 'react';
import { AppContext } from './contexts.js';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler.js';
const AppContextProvider = (props) => {
  const [isLoadingNewArtworks, setIsLoadingNewArtworks] = useState(true);
  const [errorLoadingNewArtworks, seterrorLoadingNewArtworks] = useState('');
  const [newArtworks, setNewArtworks] = useState([]);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [errorLoadingArtworks, seterrorLoadingArtworks] = useState('');
  const [artworks, setArtworks] = useState([]);
  const [totalArtworksCount, setTotalArtworksCount] = useState(null);
  const [totalFilteredArtworksCount, setTotalFilteredCount] = useState(null);
  const [totalNumPages, setTotalNumPages] = useState(1);

  const worksPerPage = 6;
  // const [userData, setUserData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getNewArtworks = useCallback(async () => {
    try {
      setIsLoadingNewArtworks(true);

      const { data } = await axios.get(
        backendUrl +
          '/api/artworks?page=1&limit=3&fields=title,price,available,width,height,discount,description,images,createdAt'
      );

      if (data.status === 'success') {
        setNewArtworks(data.data.data);
      }
    } catch (err) {
      console.log(err);
      seterrorLoadingNewArtworks(getErrorMessage(err));
    } finally {
      setIsLoadingNewArtworks(false);
    }
  }, [backendUrl]);
  const getArtworks = useCallback(
    async (query) => {
      try {
        setIsLoadingArtworks(true);
        const response = await axios.get(backendUrl + `/api/artworks?${query}`);
        const data = response.data;

        if (data.status === 'success') {
          setArtworks(data.data.data);
          setTotalFilteredCount(data.totalFilteredCount); // Use the filtered count
          setTotalNumPages(Math.ceil(data.totalFilteredCount / worksPerPage));
        }
      } catch (err) {
        console.log(err);
        seterrorLoadingArtworks(`${err.message}: Failed To Get Artworks`);
      } finally {
        setIsLoadingArtworks(false);
      }
    },
    [backendUrl]
  );
  const value = {
    newArtworks,
    getArtworks,
    artworks,
    setNewArtworks,
    isLoadingNewArtworks,
    errorLoadingNewArtworks,
    totalArtworksCount,
    worksPerPage,
    errorLoadingArtworks,
    isLoadingArtworks,
    totalFilteredArtworksCount,
    totalNumPages,
    backendUrl,
  };
  useEffect(
    function () {
      getNewArtworks();
    },
    [getNewArtworks]
  );
  // useEffect(
  //   function () {
  //     if (token) getUserData();
  //     else setUserData(false);
  //   },
  //   [token, getUserData]
  // );
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
