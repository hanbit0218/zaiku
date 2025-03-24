// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check localStorage for existing user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Load cart count
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      setCartCount(cartItems.length);
    }
    
    setIsLoading(false);
  }, []);

  // Check if token is valid
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token && currentUser) {
        try {
          const response = await fetch('/api/auth/validate-token', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            // Token is invalid, log out user
            logout();
          }
        } catch (error) {
          console.error('Token validation error:', error);
        }
      }
    };
    
    validateToken();
    
    // Set up interval to validate token periodically (e.g., every 15 minutes)
    const intervalId = setInterval(validateToken, 15 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [currentUser]);

  const login = (userData, token, rememberMe) => {
    setCurrentUser(userData);
    
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Save token to appropriate storage
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    
    // Clear token and user data
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const value = {
    currentUser,
    isLoading,
    cartCount,
    login,
    logout,
    updateCartCount
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}