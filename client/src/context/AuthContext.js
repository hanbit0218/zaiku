// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create API instance
const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

const register = async (username, email, password) => {
  try {
    const response = await API.post('/auth/register', { username, email, password });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Register API error:', error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed' 
    };
  }
};

const validateToken = async () => {
  try {
    const response = await API.get('/auth/validate-token');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Token validation API error:', error.response?.data || error.message);
    return { success: false };
  }
};

const getUserProfile = async () => {
  try {
    const response = await API.get('/users/profile');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get profile API error:', error.response?.data || error.message);
    return { success: false };
  }
};

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

  const loginWithGoogle = async (tokenResponse) => {
    try {
      console.log('Google login with access token', tokenResponse);
      
      // Check if we have the access token
      if (!tokenResponse.access_token) {
        console.error('No access token in response', tokenResponse);
        return { success: false, message: 'No access token received from Google' };
      }
      
      // Call your backend to verify the token and get user info
      const response = await API.post('/auth/google-token', {
        access_token: tokenResponse.access_token
      });
      
      if (response.data && response.data.token) {
        setCurrentUser(response.data);
        localStorage.setItem('token', response.data.token);
        return { success: true };
      } else {
        console.error('Invalid response from server', response.data);
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred: ' + (error.response?.data?.message || error.message || '')
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

  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    cartCount,
    loginUser,
    registerUser,
    loginWithGoogle,
    logout,
    updateCartCount
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}