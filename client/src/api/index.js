// client/src/api/index.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const API = axios.create({
  baseURL: API_URL,
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
export const login = async (email, password) => {
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

export const register = async (username, email, password) => {
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

export const validateToken = async () => {
  try {
    const response = await API.get('/auth/validate-token');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Token validation API error:', error.response?.data || error.message);
    return { success: false };
  }
};

// User API calls
export const getUserProfile = async () => {
  try {
    const response = await API.get('/users/profile');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get profile API error:', error.response?.data || error.message);
    return { success: false };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await API.put('/users/profile', userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Update profile API error:', error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Profile update failed' 
    };
  }
};

// Order API calls
export const createOrder = async (orderData) => {
  try {
    const response = await API.post('/orders', orderData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Create order API error:', error.response?.data || error.message);
    return { success: false };
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await API.get(`/orders/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get order API error:', error.response?.data || error.message);
    return { success: false };
  }
};

export const updateOrderToPaid = async (id, paymentResult) => {
  try {
    const response = await API.put(`/orders/${id}/pay`, paymentResult);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Update order API error:', error.response?.data || error.message);
    return { success: false };
  }
};

export const getMyOrders = async () => {
  try {
    const response = await API.get('/orders/myorders');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get orders API error:', error.response?.data || error.message);
    return { success: false };
  }
};

export default API;