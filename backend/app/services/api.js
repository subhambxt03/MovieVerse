import axios from 'axios';
import { toast } from 'react-toastify';

// ✅ PRODUCTION URL - No localhost fallback
const API_BASE_URL = 'https://movieverse-zgi7.onrender.com/api';

console.log('🚀 MovieVerse API URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // ✅ 60 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📡 Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    // ✅ Only handle ACTUAL errors
    if (error.response) {
      // Server responded with an error status
      console.error('❌ Server Error:', error.response.status, error.response.data);
      
      // Handle 401 - Unauthorized (token expired)
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true;
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token');
          }
          
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return api(error.config);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Show user-friendly message
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      
      // Don't show toast for 409 (user already exists) - let the form handle it
      if (error.response.status !== 409) {
        toast.error(message);
      }
      
      return Promise.reject(error);
    }
    
    // ✅ Network errors (no response from server)
    if (error.request) {
      console.error('❌ No response from server:', error.request);
      toast.error('Cannot connect to server. Please check your internet connection.');
      return Promise.reject(error);
    }
    
    // ✅ Other errors
    console.error('❌ Error:', error.message);
    toast.error('An unexpected error occurred');
    return Promise.reject(error);
  }
);

export default api;