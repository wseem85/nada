import { useCallback, useContext, useState } from 'react';
import { AuthContext, CartContext } from './contexts.js';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler.js';
import { useQueryClient } from '@tanstack/react-query';
const CartContextProvider = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('artworksCart')) || []
  );
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(true);
  const [errorGetCart, setErrorGetCart] = useState('');
  const [errorUpdateCart, setErrorUpdateCart] = useState('');
  const updateCartData = useCallback(
    async (newCart) => {
      if (!user) {
        localStorage.setItem('artworksCart', JSON.stringify(newCart));
        setCart(newCart);
      }
      if (user) {
        try {
          setIsUpdatingCart(true);
          const { data } = await axios.patch(
            backendUrl + '/api/users/me/cart',
            {
              cart: newCart,
            }
          );

          if (data.status === 'success') {
            setCart(data.data.cart);
            console.log(data.data.cart);
            
            // Invalidate cart-related queries
            queryClient.invalidateQueries(['cart']);
          }
        } catch (err) {
          console.log(err);
          setErrorUpdateCart(err.message);
          setIsUpdatingCart(false);
        } finally {
          setIsUpdatingCart(false);
        }
      }
    },
    [backendUrl, user]
  );
  const getCartData = useCallback(async () => {
    console.log('getCartData runs');
    if (!user) {
      console.log('getCartData runs:There is no user ');
      const localCart = JSON.parse(localStorage.getItem('artworksCart')) || [];
      setCart(localCart);
      setIsLoadingCart(false);
      return;
    }
    if (user) {
      console.log('getCartData runs:There a user ');
      try {
        setIsLoadingCart(true);
        const { data } = await axios.get(backendUrl + '/api/users/me/cart');

        if (data.status === 'success') {
          const localCart = JSON.parse(localStorage.getItem('artworksCart')) || [];
          console.log('server cart:', data.cart);
          console.log('local cart:', localCart);

          // Merge local cart with server cart
          const merged = [...data.cart];
          if (localCart.length) {
            localCart.forEach((localItem) => {
              // Check if local item already exists in server cart
              const existsInServer = merged.some(
                (item) => item.artwork._id === localItem.artwork._id
              );
              
              if (!existsInServer) {
                // Add local item to merged cart
                merged.push({
                  artwork: localItem.artwork._id,
                  addedAt: localItem.addedAt || localItem.createdAt,
                });
              }
            });
          }
          
          console.log('merged cart:', merged);
          
          // Update server with merged cart
          if (merged.length !== data.cart.length) {
            await updateCartData(merged);
          } else {
            setCart(merged);
          }
          
          // Clear local cart after successful merge
          localStorage.removeItem('artworksCart');
        }
      } catch (err) {
        console.log(err);
        setErrorGetCart(err.message);
        setIsLoadingCart(false);
      } finally {
        setIsLoadingCart(false);
      }
    }
  }, [user, backendUrl, updateCartData]);

  const addToCart = async (artID) => {
    if (!user) {
      try {
        setIsUpdatingCart(true);
        const { data } = await axios.get(backendUrl + `/api/artworks/${artID}`);
        if (data.status === 'success') {
          const artwork = data.data.data;
          const newLocalCart = [...cart, { artwork, addedAt: Date.now() }];
          localStorage.setItem('artworksCart', JSON.stringify(newLocalCart));
          setCart(newLocalCart);
          
          // Invalidate cart-related queries
          queryClient.invalidateQueries(['cart']);
          toast.success('Item added to cart');
        }
      } catch (err) {
        console.log(err);
        toast.error(getErrorMessage(err));
      } finally {
        setIsUpdatingCart(false);
      }

      return;
    }
    if (user) {
      const newartworkCart = [...cart, { artwork: artID, addedAt: Date.now() }];
      console.log(newartworkCart);
      try {
        await updateCartData(newartworkCart);
        toast.success('Item added to cart');
      } catch (err) {
        console.log(err);
        toast.error(getErrorMessage(err));
      }
    }
  };
  const removeFromCart = async (artID) => {
    if (!user) {
      const newLocalCart = cart.filter((item) => item.artwork._id !== artID);
      localStorage.setItem('artworksCart', JSON.stringify(newLocalCart));
      setCart(newLocalCart);
      
      // Invalidate cart-related queries
      queryClient.invalidateQueries(['cart']);
      toast.success('Item removed from cart');
      return;
    }
    if (user) {
      const newartworkCart = cart.filter((item) => item.artwork._id !== artID);

      try {
        await updateCartData(newartworkCart);
        toast.success('Item removed from cart');
      } catch (err) {
        console.log(err);
        toast.error(getErrorMessage(err));
      }
    }
  };

  const value = {
    cart,
    setCart,
    isLoadingCart,
    errorGetCart,
    getCartData,
    updateCartData,
    addToCart,
    removeFromCart,
  };
  useEffect(
    function () {
      async function fetchCart() {
        await getCartData();
      }
      fetchCart();
    },
    [getCartData]
  );
  useEffect(
    function () {
      async function fetchCart() {
        await getCartData();
      }
      if (user) {
        fetchCart();
        // localStorage.removeItem('artworksCart');
      }
    },
    [user, getCartData]
  );
  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};
export default CartContextProvider;
