import React, { useState } from 'react';
import { X, AlertCircle, Check, Loader2, Upload } from 'lucide-react';
import { productAPI } from '/src/services/authAPI';

const PostProductForm = ({ categories, setShowPostForm, onProductPosted }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    priceType: 'fixed',
    category: categories.length > 0 ? categories[0].value : '',
    location: '',
    description: ''
  });

  // File and preview states
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'description' && value.length > 2000) {
      return; // Don't exceed max length
    }
    
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user starts typing
    if (postError) setPostError('');
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (images.length + files.length > 3) {
      setPostError('Maximum 3 images allowed');
      return;
    }
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setPostError('Only JPG, PNG, and WebP images are allowed');
        return false;
      }
      
      if (file.size > maxSize) {
        setPostError(`File "${file.name}" exceeds 5MB limit`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    // Update states
    setImages(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    
    // Clear errors
    setPostError('');
  };

  // Remove selected image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (images.length === 0) {
      setPostError('Please upload at least one image');
      return;
    }
    
    if (!formData.title.trim() || !formData.price || !formData.category || !formData.location) {
      setPostError('Please fill all required fields');
      return;
    }
    
    // Create FormData for multipart upload
    const formDataToSend = new FormData();
    
    // Append product data
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('priceType', formData.priceType);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('location', formData.location.trim());
    formDataToSend.append('description', formData.description.trim());
    
    // Append images
    images.forEach((image, index) => {
      formDataToSend.append('images', image);
    });
    
    // Add metadata
    formDataToSend.append('status', 'pending');
    
    setLoading(true);
    setPostError('');
    
    try {
      // API call to post product using the productAPI
      const response = await productAPI.createProduct(formDataToSend);
      
      if (response.success) {
        setPostSuccess('Product posted successfully! Awaiting admin approval.');
        
        // Clear form
        setTimeout(() => {
          setFormData({
            title: '',
            price: '',
            priceType: 'fixed',
            category: categories.length > 0 ? categories[0].value : '',
            location: '',
            description: ''
          });
          
          // Clear images and previews
          previews.forEach(preview => URL.revokeObjectURL(preview));
          setImages([]);
          setPreviews([]);
          
          // Notify parent component
          if (onProductPosted) {
            onProductPosted(response.product || response.data);
          }
          
          // Close form after delay
          setTimeout(() => {
            setShowPostForm(false);
          }, 2000);
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to post product');
      }
    } catch (error) {
      console.error('Error posting product:', error);
      
      // Handle error from API
      if (error.message) {
        setPostError(error.message);
      } else if (error.originalError?.response?.data?.message) {
        setPostError(error.originalError.response.data.message);
      } else if (error.originalError?.response?.data?.errors) {
        // Handle validation errors
        const errors = error.originalError.response.data.errors;
        const errorMessages = Array.isArray(errors) 
          ? errors.map(err => err.message || err).join(', ')
          : JSON.stringify(errors);
        setPostError(`Validation errors: ${errorMessages}`);
      } else if (error.originalError?.request) {
        setPostError('Network error. Please check if backend is running.');
      } else {
        setPostError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Post Your Product</h2>
              <p className="text-blue-100 mt-1">Fill in the details below. Approval within 24 hours.</p>
            </div>
            <button
              onClick={() => setShowPostForm(false)}
              className="text-white hover:text-blue-200 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {postError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-red-700">{postError}</span>
            </div>
          )}

          {postSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start animate-fade-in">
              <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <span className="text-green-700 font-medium">{postSuccess}</span>
                <p className="text-green-600 text-sm mt-1">Form will close automatically...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="What are you selling?"
                  required
                  disabled={loading}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Price Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="priceType"
                        value="fixed"
                        checked={formData.priceType === 'fixed'}
                        onChange={handleChange}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 ${formData.priceType === 'fixed' ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                        {formData.priceType === 'fixed' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-gray-700">Fixed</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="priceType"
                        value="negotiable"
                        checked={formData.priceType === 'negotiable'}
                        onChange={handleChange}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 ${formData.priceType === 'negotiable' ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                        {formData.priceType === 'negotiable' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-gray-700">Negotiable</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
                    required
                    disabled={loading}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="City, State"
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description 
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-40 resize-none"
                  placeholder="Describe your product..."
                  required
                  maxLength="2000"
                  disabled={loading}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {formData.description.length}/2000 characters
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images (1-3 required)
                </label>
                
                {/* Upload Area */}
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  loading 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-gray-300 hover:border-blue-400 bg-gray-50'
                }`}>
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    loading ? 'text-gray-300' : 'text-gray-400'
                  }`} />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={loading || images.length >= 3}
                  />
                  <label htmlFor="image-upload" className={`cursor-pointer ${loading ? 'cursor-not-allowed' : ''}`}>
                    <div className="text-gray-600 mb-2">
                      <span className={`font-semibold ${loading ? 'text-gray-400' : 'text-blue-600'}`}>
                        Click to upload
                      </span> or drag and drop
                    </div>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, WebP • Max 5MB each • 1-3 images
                    </p>
                    {images.length >= 3 && (
                      <p className="text-sm text-red-500 mt-2">
                        Maximum 3 images reached
                      </p>
                    )}
                  </label>
                </div>

                {/* Image Previews */}
                {previews.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Selected Images ({images.length}/3)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            disabled={loading}
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || images.length === 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  loading || images.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Submitting for Approval...
                  </span>
                ) : (
                  'Post Your Product'
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-3">
                ⏳ Your product will be reviewed within 24 hours
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



export default PostProductForm;