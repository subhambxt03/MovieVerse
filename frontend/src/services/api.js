import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://movieverse-zgi7.onrender.com/api';

console.log('🚀 MovieVerse API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, 
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    // ✅ Only handle ACTUAL errors
    if (error.response) {
      console.error('❌ Server Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401 && !error.config._retry) {
        // ... token refresh logic
      }
      
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      if (error.response.status !== 409) {
        toast.error(message);
      }
      return Promise.reject(error);
    }
    
    if (error.request) {
      console.error('❌ No response from server');
      toast.error('Server is taking too long to respond. Please try again.');
      return Promise.reject(error);
    }
    
    console.error('❌ Error:', error.message);
    toast.error('An unexpected error occurred');
    return Promise.reject(error);
  }
);

export default api;