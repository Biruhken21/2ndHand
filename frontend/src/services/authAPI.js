// services/authAPI.js
import axios from 'axios';

// ⚠️ IMPORTANT: Use '/api' NOT the full localhost:5000 URL
const API = axios.create({
  baseURL: '/api',  // This will go through Vite proxy to localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(errorMessage);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.get('/auth/logout'),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  test: () => API.get('/auth/test'),
};

export default API;