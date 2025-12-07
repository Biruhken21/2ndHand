import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, X, AlertCircle, Check, Loader2, 
  PlusCircle, Package, MapPin, DollarSign, 
  Calendar, ChevronDown, ChevronUp, Eye,
  Heart, Share2, MessageCircle, Filter,
  Search, Grid, List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Components
import DashboardHeader from '/src/components/DashboardHeader';
import PostProductForm from '/src/components/PostProductForm';
import ProductsSection from '/src/components/ProductsSection';
import DashboardFilters from '/src/components/DashboardFilters';

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  // Product posting form states
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceType: 'fixed',
    category: 'electronics',
    location: ''
  });
  
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');
  
  // Approved products states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('newest');
  
  const categories = [
    { value: 'electronics', label: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-600' },
    { value: 'vehicles', label: 'Vehicles', icon: '🚗', color: 'bg-red-100 text-red-600' },
    { value: 'properties', label: 'Properties', icon: '🏠', color: 'bg-green-100 text-green-600' },
    { value: 'services', label: 'Services', icon: '🛠️', color: 'bg-purple-100 text-purple-600' },
    { value: 'other', label: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-600' }
  ];

  // Fetch approved products
  useEffect(() => {
    fetchApprovedProducts();
  }, [selectedCategory, sortBy]);

  const fetchApprovedProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await axios.get('http://localhost:5000/api/products', {
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sortBy: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? '-price' : '-createdAt'
        }
      });
      
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Product posting handlers (same as before but with UI enhancements)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'description') {
      const phonePatterns = [/\d{10,}/, /\d{3}[-.]?\d{3}[-.]?\d{4}/, /\(\d{3}\)\s?\d{3}[-.]?\d{4}/];
      const emailPattern = /[\w\.-]+@[\w\.-]+\.\w+/;
      
      const hasPhone = phonePatterns.some(pattern => pattern.test(value));
      const hasEmail = emailPattern.test(value);
      
      if (hasPhone || hasEmail) {
        setPostError('Please do not include contact information in the description');
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setPostError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) {
      setPostError('Please select at least 1 image');
      return;
    }
    
    if (files.length > 3) {
      setPostError('Maximum 3 images allowed');
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setPostError('Only JPG, PNG, and WebP images are allowed');
      return;
    }
    
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setPostError('Each image should be less than 5MB');
      return;
    }
    
    setImages(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setPostError('');
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPostError('');
    setPostSuccess('');

    if (!user) {
      setPostError('Please login to post products');
      setLoading(false);
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      setPostError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setPostError('Please upload at least 1 image');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      images.forEach(image => formDataToSend.append('images', image));

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/products', formDataToSend, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setPostSuccess(response.data.message);
        setFormData({ title: '', description: '', price: '', priceType: 'fixed', category: 'electronics', location: '' });
        setImages([]);
        setPreviews([]);
        document.querySelector('input[type="file"]').value = '';
        
        // Refresh products list
        fetchApprovedProducts();
        
        // Close form after success
        setTimeout(() => {
          setShowPostForm(false);
          setPostSuccess('');
        }, 3000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setPostError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 413) {
        setPostError('File too large. Maximum 5MB per image.');
      } else {
        setPostError(err.response?.data?.message || 'Error submitting product');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <DashboardHeader 
        user={user}
        showPostForm={showPostForm}
        setShowPostForm={setShowPostForm}
      />

      {/* Post Product Form */}
      {showPostForm && (
        <PostProductForm 
          formData={formData}
          images={images}
          previews={previews}
          loading={loading}
          postError={postError}
          postSuccess={postSuccess}
          categories={categories}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
          handleSubmit={handleSubmit}
          setShowPostForm={setShowPostForm}
        />
      )}

      {/* Approved Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Products Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Approved Products</h2>
          <p className="text-gray-600">Browse through all approved listings</p>
        </div>

        {/* Filters and Search */}
        <DashboardFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          categories={categories}
        />

        {/* Products Grid/List */}
        <ProductsSection 
          loadingProducts={loadingProducts}
          filteredProducts={filteredProducts}
          viewMode={viewMode}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          setShowPostForm={setShowPostForm}
          products={products}
        />
      </div>
    </div>
  );
};

export default UserDashboard;