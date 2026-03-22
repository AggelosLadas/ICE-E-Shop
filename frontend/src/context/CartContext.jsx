import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const CartContext = createContext(null);

const getStorageKey = (username) => username ? `cart_${username}` : 'cart_guest';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const { user } = useAuth();

  const loadCartFromBackend = useCallback(async () => {
    if (!user) return;
    setCartLoading(true);
    try {
      const response = await userAPI.getCart();
      const backendCart = (response.data || []).map(item => ({
        productCode: item.product.productCode,
        productName: item.product.productName,
        productPrice: item.product.productPrice,
        productDescription: item.product.productDescription,
        productImage: item.product.productImage,
        productQuantity: item.product.productQuantity,
        quantity: item.quantity,
      }));
      setCart(backendCart);
      localStorage.setItem(getStorageKey(user.username), JSON.stringify(backendCart));
    } catch (error) {
      console.error('Error loading cart from backend:', error);
      const stored = localStorage.getItem(getStorageKey(user.username));
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCartFromBackend();
    } else {
      setCart([]);
    }
  }, [user, loadCartFromBackend]);

  const saveLocally = (newCart) => {
    const key = getStorageKey(user?.username);
    localStorage.setItem(key, JSON.stringify(newCart));
  };

  const addToCart = async (product, qty = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productCode === product.productCode);
      let newCart;
      if (existingItem) {
        newCart = prev.map(item =>
          item.productCode === product.productCode
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: qty }];
      }
      saveLocally(newCart);
      return newCart;
    });

    if (user) {
      try {
        await userAPI.addToCart({
          username: user.username,
          productCode: product.productCode,
          quantity: qty,
        });
      } catch (error) {
        console.error('Error syncing addToCart with backend:', error);
      }
    }
  };

  const removeFromCart = async (productCode) => {
    const previousCart = [...cart];
    const newCart = cart.filter(item => item.productCode !== productCode);
    setCart(newCart);
    saveLocally(newCart);

    if (user) {
      try {
        const response = await userAPI.removeFromCart(productCode);
        console.log('[Cart] removeFromCart success:', response.status);
        setSyncError(null);
      } catch (error) {
        console.error('[Cart] removeFromCart FAILED:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
          headers: error.config?.headers,
        });
        setCart(previousCart);
        saveLocally(previousCart);
        const status = error.response?.status;
        if (status === 401) {
          setSyncError('Η σύνδεσή σας έληξε. Παρακαλώ κάντε logout και login ξανά.');
        } else if (status === 404) {
          setSyncError('Το προϊόν δεν βρέθηκε στο καλάθι.');
        } else {
          setSyncError('Αποτυχία διαγραφής προϊόντος. Δοκιμάστε ξανά.');
        }
      }
    }
  };

  const updateQuantity = async (productCode, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productCode);
      return;
    }

    const previousCart = [...cart];
    const newCart = cart.map(item =>
      item.productCode === productCode ? { ...item, quantity } : item
    );
    setCart(newCart);
    saveLocally(newCart);

    if (user) {
      try {
        await userAPI.updateCartItem(productCode, quantity);
        setSyncError(null);
      } catch (error) {
        console.error('Error syncing updateQuantity with backend:', error);
        setCart(previousCart);
        saveLocally(previousCart);
        setSyncError('Αποτυχία ενημέρωσης ποσότητας. Δοκιμάστε ξανά.');
      }
    }
  };

  const clearCart = async () => {
    const previousCart = [...cart];
    const previousKey = getStorageKey(user?.username);
    const previousStored = localStorage.getItem(previousKey);

    setCart([]);
    localStorage.removeItem(previousKey);

    if (user) {
      try {
        await userAPI.clearCart();
        setSyncError(null);
      } catch (error) {
        console.error('Error syncing clearCart with backend:', error);
        setCart(previousCart);
        if (previousStored) {
          localStorage.setItem(previousKey, previousStored);
        }
        setSyncError('Αποτυχία εκκαθάρισης καλαθιού. Δοκιμάστε ξανά.');
      }
    }
  };

  const clearCartLocally = () => {
    setCart([]);
    localStorage.removeItem(getStorageKey(user?.username));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartLoading,
      syncError,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      clearCartLocally,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
