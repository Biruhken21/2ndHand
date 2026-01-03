import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error('Network error');
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response.data;
  },
  (error) => {
    const { status, data } = error.response || {};
    
    if (status === 403) {
      toast.error('Admin access required');
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    } else if (status === 401) {
      toast.error('Session expired');
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    } else if (data?.message) {
      toast.error(data.message);
    } else {
      toast.error('Something went wrong');
    }
    
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // ========== AUTH ==========
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.get('/auth/logout'),
  getProfile: () => API.get('/auth/me'),
  
  // ========== PRODUCTS ==========
  getPendingProducts: (params) => API.get('/admin/products/pending', { params }),
  approveProduct: (id, action, reason) => 
    API.put(`/admin/products/${id}/approve`, { action, reason }),
  getAllProducts: (params) => API.get('/admin/products', { params }),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`),
  createProduct: (productData) => API.post('/admin/products', productData), 
  
  // ========== USERS ==========
  getAllUsers: (params) => API.get('/admin/users', { params }),
  
  // ========== INQUIRIES ==========
  getAllInquiries: (params) => API.get('/admin/inquiries', { params }),
  
  // ========== STATISTICS ==========
  getDashboardStats: () => API.get('/admin/stats'),
  
  // Fallback if /stats endpoint doesn't exist
  getTotalStats: async () => {
    try {
      const [products, users, pending] = await Promise.all([
        API.get('/admin/products?limit=1&page=1'),
        API.get('/admin/users?limit=1&page=1'),
        API.get('/admin/products/pending?limit=1&page=1')
      ]);
      
      return {
        totalProducts: products.total || 0,
        totalUsers: users.total || 0,
        pendingProducts: pending.total || 0,
        approvedProducts: Math.floor((products.total || 0) * 0.7), // Example
        todayInquiries: 12, // Example
        conversionRate: 68, // Example
        totalRevenue: 24500, // Example
        avgProductPrice: 450, // Example
        totalViews: 12450, // Example
        engagementRate: 78 // Example
      };
    } catch (error) {
      console.error('Failed to load stats:', error);
      return {
        totalProducts: 0,
        totalUsers: 0,
        pendingProducts: 0,
        approvedProducts: 0,
        todayInquiries: 0,
        conversionRate: 0,
        totalRevenue: 0,
        avgProductPrice: 0,
        totalViews: 0,
        engagementRate: 0
      };
    }
  }
};

export default API;