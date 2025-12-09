import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor - UPDATED for FormData support
API.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Handle FormData differently - don't log binary data
    if (config.data instanceof FormData) {
      console.log('Request: FormData with', Array.from(config.data.entries()).length, 'entries');
      // For FormData, remove Content-Type header so browser sets it with boundary
      delete config.headers['Content-Type'];
    } else {
      console.log('Request data:', config.data);
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error Full Details:', {
      URL: error.config?.url,
      Method: error.config?.method,
      Status: error.response?.status,
      StatusText: error.response?.statusText,
      Data: error.response?.data,
      Message: error.message,
      Code: error.code
    });

    if (error.response?.data?.errors) {
      console.error('📋 Validation Errors:', error.response.data.errors);
    }

    // Extract error message
    let errorMessage = 'Something went wrong';
    
    if (error.response) {
      const { data, status } = error.response;
      
      if (status === 401) {
        errorMessage = data?.message || 'Unauthorized. Please check your credentials.';
      } else if (status === 403) {
        errorMessage = data?.message || 'Access denied. Admin privileges required.';
      } else if (status === 400) {
        errorMessage = data?.message || 'Bad request. Please check your input.';
      } else if (status === 404) {
        errorMessage = data?.message || 'Resource not found.';
      } else if (status === 500) {
        errorMessage = data?.message || 'Server error. Please try again later.';
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.errors) {
        const errors = Array.isArray(data.errors) 
          ? data.errors.map(err => err.message || err).join(', ')
          : JSON.stringify(data.errors);
        errorMessage = `Validation errors: ${errors}`;
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check if backend is running.';
    } else {
      errorMessage = error.message || 'Network error';
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error
    });
  }
);

// Auth API
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.get('/auth/logout'),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  test: () => API.get('/auth/test'),
};

// Product API
export const productAPI = {
  createProduct: (formData) => {
    return API.post('/products', formData);
  },
  getApprovedProducts: (params) => API.get('/products', { params }),
  markAsSold: (id) => API.put(`/products/${id}/sold`)
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Product Management
  getPendingProducts: (params = {}) => API.get('/admin/products/pending', { params }),
  approveProduct: (id, action, reason) => 
    API.put(`/admin/products/${id}/approve`, { action, reason }),
  
  getAllProducts: (params = {}) => API.get('/admin/products', { params }),
  
  // User Management
  getAllUsers: (params = {}) => API.get('/admin/users', { params }),
  
  // Inquiry Management
  getAllInquiries: (params = {}) => API.get('/admin/inquiries', { params }),
  
  // Helper to check if user is admin (based on token)
  isAdminUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Decode JWT token to check role (client-side check only)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin' || payload.user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
};

export default API;