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
  // Create new product
  createProduct: (formData) => {
    return API.post('/products', formData);
  },
  
  getApprovedProducts: (params) => API.get('/products', { params }),
  getProductById: (id) => API.get(`/products/${id}`),
  markAsSold: (id) => API.put(`/products/${id}/sold`),
   getMyProducts: async () => {
    try {
      console.log("Calling getMyProducts...");
      const response = await API.get('/products/user/my-products');
      console.log("getMyProducts response:", response);
      console.log("Response structure:", {
        data: response.data,
        status: response.status,
        fullResponse: response
      });
      return response;
    } catch (error) {
      console.error("getMyProducts error:", error);
      throw error;
    }
  },
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`)
};

// Action API - 
export const actionAPI = {
  // ========== FAVORITE ACTIONS ==========
  toggleFavorite: (productId) => API.put(`/actions/favorite/${productId}`),
  getFavorites: () => API.get('/actions/favorites'),
  checkFavoriteStatus: (productId) => API.get(`/actions/favorite/${productId}/status`),
  
  // ========== SHARE ACTIONS ==========
  shareProduct: (productId) => API.put(`/actions/share/${productId}`),
  
  // ========== CONTACT ACTIONS ==========
  contactSeller: (productId, data) => {
  // Check what your backend expects - try both formats
  return API.post(`/actions/contact/${productId}`, {
    message: data.message,
    name: data.name,
    email: data.email,
    phone: data.phone
  });
},
    getContactedProducts: async () => {
    try {
      console.log("Calling getContactedProducts...");
      const response = await API.get('/actions/contact/my-contacts');
      console.log("getContactedProducts response:", response);
      console.log("Response structure:", {
        data: response.data,
        status: response.status,
        fullResponse: response
      });
      return response;
    } catch (error) {
      console.error("getContactedProducts error:", error);
      throw error;
    }
  },

  // notifications actions
  getUserNotifications: () => API.get('/actions/notifications'),
  markAsRead: (notificationId) => API.put(`/actions/notifications/${notificationId}/mark-as-read`)
};

// For convenience - single export with all APIs
export const api = {
  auth: authAPI,
  products: productAPI,
  actions: actionAPI
};

export default API;