// client/src/context/AuthContext.js
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
          const result = await validateToken();
          if (result.success) {
            console.log('Token verified, user data:', result.data);
            setCurrentUser(result.data);
            
            // Also fetch detailed profile
            const profileResult = await getUserProfile();
            if (profileResult.success) {
              console.log('User profile fetched:', profileResult.data);
              setCurrentUser(prev => ({...prev, ...profileResult.data}));
            }
          } else {
            // Token is invalid, log out user
            console.log('Token validation failed, logging out');
            logout();
          }
        } catch (error) {
          console.error('Token verification error:', error);
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
      console.log('Attempting login for:', email);
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Login successful:', result.data);
        setCurrentUser(result.data);
        
        // Save token to appropriate storage
        if (rememberMe) {
          localStorage.setItem('token', result.data.token);
        } else {
          sessionStorage.setItem('token', result.data.token);
        }
        
        return { success: true };
      } else {
        console.log('Login failed:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred'
      };
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      console.log('Attempting registration for:', email);
      const result = await register(username, email, password);
      
      if (result.success) {
        console.log('Registration successful:', result.data);
        
        // Optionally automatically log in the user
        // Uncomment if you want to auto-login after registration
        /*
        setCurrentUser(result.data);
        localStorage.setItem('token', result.data.token);
        */
        
        return { success: true, data: result.data };
      } else {
        console.log('Registration failed:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred'
      };
    }
  };

  const logout = () => {
    console.log('Logging out user');
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