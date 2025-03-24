import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, register, validateToken, getUserProfile } from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        try {
          const { data } = await validateToken();
          setCurrentUser(data);
        } catch (error) {
          // Token is invalid, log out user
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    // Load cart count
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalItems);
    }
    
    verifyToken();
  }, []);

  const loginUser = async (email, password, rememberMe) => {
    try {
      const { data } = await login(email, password);
      
      setCurrentUser(data);
      
      // Save token to appropriate storage
      if (rememberMe) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const { data } = await register(username, email, password);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    
    // Clear token and user data
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const value = {
    currentUser,
    isLoading,
    cartCount,
    loginUser,
    registerUser,
    logout,
    updateCartCount
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}