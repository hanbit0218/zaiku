import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
export const login = (email, password) => API.post('/auth/login', { email, password });
export const register = (username, email, password) => API.post('/auth/register', { username, email, password });
export const validateToken = () => API.get('/auth/validate-token');

// User API calls
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (userData) => API.put('/users/profile', userData);

// Order API calls
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderToPaid = (id, paymentResult) => API.put(`/orders/${id}/pay`, paymentResult);
export const getMyOrders = () => API.get('/orders/myorders');

export default API;