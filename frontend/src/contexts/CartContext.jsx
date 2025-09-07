import { useCallback, useContext, useState } from 'react';
import { AppContext, AuthContext, CartContext } from './contexts.js';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { getErrorMessage } from '../../utils/errorHandler.js';
const CartContextProvider = (props) => {
  const { user, setUser } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('artworksCart')) || []
  );
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(true);
  const [errorGetCart, setErrorGetCart] = useState('');
  const [errorUpdateCart, setErrorUpdateCart] = useState('');

  const getCartData = async () => {
    try {
      setIsLoadingCart(true);
      const { data } = await axios.get(backendUrl + '/api/users/me/cart');
      console.log(data);
      if (data.status === 'success') {
        // localStorage.setItem('artworkCart', JSON.stringify(data.cart));
        setCart(data.cart);
      }
    } catch (err) {
      console.log(err);
      setErrorGetCart(err.message);
      setIsLoadingCart(false);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const updateCartData = async (newCart) => {
    try {
      setIsUpdatingCart(true);
      const { data } = await axios.patch(backendUrl + '/api/users/me/cart', {
        cart: newCart,
      });

      if (data.status === 'success') {
        console.log(data);
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
  };
  const addToCart = async (artID) => {
    const newartworkCart = [...cart, { artwork: artID, addedAt: Date.now() }];

    try {
      await updateCartData(newartworkCart);

      toast.success('Item added to cart');
    } catch (err) {
      console.log(err);
      toast.error(getErrorMessage(err));
    }
  };
  const removeFromCart = async (artID) => {
    const newartworkCart = cart.filter((item) => item.artwork._id !== artID);

    try {
      await updateCartData(newartworkCart);

      toast.success('Item removed from cart');
    } catch (err) {
      console.log(err);
      toast.error(getErrorMessage(err));
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
  useEffect(function () {
    async function fetchCart() {
      await getCartData();
    }
    fetchCart();
  }, []);
  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};
export default CartContextProvider;
