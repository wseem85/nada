import { useCallback, useContext, useState } from 'react';
import { AppContext, AuthContext, CartContext } from './contexts.js';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler.js';
const CartContextProvider = (props) => {
  const { user, setUser } = useContext(AuthContext);
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

            // localStorage.setItem(
            //   'artworkCart',
            //   JSON.stringify(data.updatedCart.cart)
            // );
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
          // setCart(data.cart);
          // localStorage.setItem('artworkCart', JSON.stringify(data.cart));
          const localCart = JSON.parse(localStorage.getItem('artworksCart'));
          console.log('server cart:', data.cart);
          const merged = [...data.cart];

          localCart.forEach((localItem) => {
            if (
              !merged.some((item) => item.artwork._id === localItem.artwork._id)
            ) {
              merged.push({
                artwork: localItem.artwork._id,
                createdAt: localItem.createdAt,
              });
            }
          });
          console.log('mergedcart:', merged);
          await updateCartData(merged);
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
          toast.success('Item added to cart');
        }
      } catch (err) {
        console.log(err);
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
      }
    },
    [user, getCartData]
  );
  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};
export default CartContextProvider;
