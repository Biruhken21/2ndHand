import React, { useState } from 'react';
import { 
  Package, DollarSign, Eye, Calendar,
  Heart, Share2, MessageCircle,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, PlusCircle, X,
  MapPin, Tag, Star
} from 'lucide-react';

// Single Product Card - Slightly Larger Compact Version
const ProductCard = ({ product, categories }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  const hasMultipleImages = product.images?.length > 1;
  const categoryObj = categories.find(c => c.value === product.category) || {};

  // Get the description - backend sends truncated in description, full in fullDescription
  const shortDescription = product.description; // Already truncated from backend (150 chars)
  const fullDescription = product.fullDescription || product.description; // Full description
  
  // For lightbox: Show truncated first, then full when "See More" clicked
  const shortLimit = 150;
  const showTruncatedInLightbox = fullDescription?.length > shortLimit;
  const truncatedForLightbox = showTruncatedInLightbox 
    ? fullDescription.substring(0, shortLimit) + '...' 
    : fullDescription;

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
    setImageLoaded(false);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} for $${product.price}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // Handle lightbox navigation
  const handleLightboxNext = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
  };

  const handleLightboxPrev = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleContact = (e) => {
    e.stopPropagation();
    // Contact logic here
  };

  return (
    <>
      {/* Compact Product Card - Slightly Larger */}
      <div 
        className={`product-card group bg-white rounded-xl shadow-md overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col h-[330px] w-full cursor-pointer ${
          cardHovered 
            ? product.priceType === 'fixed'
              ? 'border-emerald-300 shadow-emerald-100/50'
              : 'border-amber-300 shadow-amber-100/50'
            : 'border-gray-100 hover:border-gray-200'
        }`}
        onClick={() => setLightboxOpen(true)}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        
        {/* Price Type Badge - Original position (outside card) */}
        <div className="absolute -top-2 -right-2 z-30">
          <div className="relative">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
              product.priceType === 'fixed'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-2 border-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-2 border-white'
            }`}>
              {product.priceType === 'fixed' ? 'FIXED' : 'NEGOTIABLE'}
            </span>
            <div className={`absolute -bottom-1 right-3 w-2.5 h-2.5 transform rotate-45 border-r border-b border-white ${
              product.priceType === 'fixed' ? 'bg-emerald-600' : 'bg-orange-500'
            }`}></div>
          </div>
        </div>

        {/* Image Section - Slightly Larger */}
        <div 
          className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300"></div>
          )}
          
          <img
            src={product.images?.[currentImageIndex] || ''}
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
            }`}
            draggable={false}
            onLoad={handleImageLoad}
            onError={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Image Navigation Dots */}
          {hasMultipleImages && (
            <div 
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                    setImageLoaded(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section - More Space */}
        <div className="p-3 flex flex-col flex-1">
          {/* Product Info */}
          <div className="flex-1 mb-3">
            {/* Title */}
            <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5">
              {product.title}
            </h3>
            
            {/* Price and Location */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${product.price}
              </div>
              {product.location && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate max-w-[80px]">{product.location.split(',')[0]}</span>
                </div>
              )}
            </div>
            
            {/* Category and Date */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className={`px-2 py-1 rounded text-xs font-medium ${categoryObj.color || 'bg-gray-100 text-gray-700'} truncate max-w-[100px]`}>
                {categoryObj.label || 'Uncategorized'}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0">•</span>
              <span className="text-xs text-gray-500 flex items-center flex-shrink-0">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Action Buttons - More Spacing */}
          <div className="border-t border-gray-100 pt-3 mt-auto">
            <div className="flex items-center justify-between">
              {/* Left: Action Buttons - More Spacing */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {/* Views Display */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 border border-gray-200">
                  <Eye className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-medium">{product.views || 0}</span>
                </div>
                
                {/* Favorite Button */}
                <button 
                  onClick={handleLike}
                  className={`relative p-1.5 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    liked 
                      ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-500 shadow-sm border border-red-200' 
                      : 'text-gray-500 hover:text-red-500 hover:bg-red-50 border border-transparent'
                  }`} 
                  title="Favorite"
                >
                  <Heart className={`w-3.5 h-3.5 transition-all duration-300 ${liked ? 'fill-current' : ''}`} />
                  {liked && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  )}
                </button>
                
                {/* Share Button */}
                <button 
                  onClick={handleShare}
                  className={`relative p-1.5 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    shared 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-500 shadow-sm border border-green-200' 
                      : 'text-gray-500 hover:text-green-500 hover:bg-green-50 border border-transparent'
                  }`} 
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5 transition-all duration-300" />
                  {shared && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                  )}
                </button>
              </div>
              
              {/* Right: Contact Button */}
              <button 
                onClick={handleContact}
                className="group relative flex items-center gap-1.5 px-3.5 py-1.5 text-white text-xs font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                     }}>
                </div>
                
                {/* Message icon */}
                <div className="relative z-10">
                  <MessageCircle className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                {/* Text */}
                <span className="relative z-10 font-semibold tracking-wide">
                  Contact Us
                </span>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX - Full Product Details */}
      {lightboxOpen && (
        <div 
          className="lightbox fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl h-[95vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setLightboxOpen(false)} 
              className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full transition-all duration-200 shadow-lg hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-full flex flex-col">
              {/* Lightbox Image Section */}
              <div className="relative h-[45%] min-h-[350px] bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <img 
                    src={product.images[currentImageIndex]} 
                    alt={product.title} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    draggable={false}
                  />
                </div>
                
                {/* Image navigation */}
                {hasMultipleImages && (
                  <>
                    <button 
                      onClick={handleLightboxPrev} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleLightboxNext} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* PRODUCT INFO SECTION */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-5">
                  {/* Header */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${categoryObj.color || 'bg-gray-100 text-gray-700'}`}>
                        {categoryObj.label || 'Uncategorized'}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        product.priceType === 'fixed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {product.priceType === 'fixed' ? 'Fixed Price' : 'Negotiable'}
                      </span>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${product.price}
                    </div>
                  </div>

                  {/* Location */}
                  {product.location && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center text-blue-700 mb-2">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="font-medium">Location</span>
                      </div>
                      <p className="text-gray-700">{product.location}</p>
                    </div>
                  )}

                  {/* Description */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-gray-500" />
                      Product Description
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {showFullDescription ? fullDescription : truncatedForLightbox}
                      </p>
                    </div>
                    {showTruncatedInLightbox && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {showFullDescription ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" /> 
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" /> 
                            See More
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Views</p>
                          <p className="text-xl font-bold text-gray-900">{product.views || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Rating</p>
                          <p className="text-xl font-bold text-gray-900">4.8</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Enhanced Design */}
                  <div className="border-t border-gray-200 pt-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Icon Buttons - Enhanced */}
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        {/* Views Display */}
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-sm">
                          <Eye className="w-4.5 h-4.5 text-gray-600" />
                          <div className="text-center">
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Views</p>
                            <p className="text-lg font-bold text-gray-900">{product.views || 0}</p>
                          </div>
                        </div>
                        
                        {/* Favorite Button */}
                        <button 
                          onClick={handleLike}
                          className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                            liked 
                              ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-600 border border-red-300 shadow-md' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                          }`} 
                          title="Favorite"
                        >
                          <Heart className={`w-4.5 h-4.5 transition-all duration-300 ${liked ? 'fill-current' : ''}`} />
                          {liked && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                          )}
                        </button>
                        
                        {/* Share Button */}
                        <button 
                          onClick={handleShare}
                          className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                            shared 
                              ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600 border border-green-300 shadow-md' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                          }`} 
                          title="Share"
                        >
                          <Share2 className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-6" />
                          {shared && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                          )}
                        </button>
                      </div>
                      
                      {/* Contact Button - Elegant */}
                      <button className="group relative flex items-center justify-center gap-3 px-5 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 100%)',
                          backgroundSize: '400% 400%'
                        }}
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-50"
                             style={{
                               animation: 'gradientShift 3s ease infinite'
                             }}>
                        </div>
                        
                        {/* Message icon */}
                        <div className="relative z-10">
                          <MessageCircle className="w-4.5 h-4.5 transition-all duration-300 group-hover:scale-110" />
                        </div>
                        
                        {/* Text */}
                        <span className="relative z-10 font-semibold tracking-wide">
                          Contact Seller
                        </span>
                        
                        {/* Shine effect */}
                        <div className="absolute inset-y-0 w-1/3 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700">
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Products Section with 4 cards per row
const ProductsSection = ({ loadingProducts, filteredProducts, viewMode, searchTerm, selectedCategory, categories, setShowPostForm, products }) => {
  const totalProducts = products.length;
  const averagePrice = products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00';
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

  if (loadingProducts) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    </div>
  );

  if (!filteredProducts.length) return (
    <div className="text-center py-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 mx-4 lg:mx-0">
      <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Products Found</h3>
      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        {searchTerm 
          ? `No products found for "${searchTerm}"` 
          : selectedCategory !== 'all' 
            ? 'No products in this category' 
            : 'No approved products yet'}
      </p>
      <button 
        onClick={() => setShowPostForm(true)} 
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        <PlusCircle className="w-6 h-6 mr-3" /> Be the first to post!
      </button>
    </div>
  );

  return (
    <div className="product-display px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Products ({filteredProducts.length})</h2>
        <p className="text-gray-600 mt-1">Browse through all available listings</p>
      </div>
      
      {/* Product Grid with 4 cards per row - Slightly larger cards */}
      <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
        {filteredProducts.map(product => (
          <div key={product.id} className="flex justify-center">
            <div className="w-full max-w-[280px]">
              <ProductCard product={product} categories={categories} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Package className="w-6 h-6" />} 
          title="Total Products" 
          value={totalProducts.toLocaleString()} 
          color="from-blue-500 to-blue-600" 
        />
        <StatCard 
          icon={<DollarSign className="w-6 h-6" />} 
          title="Average Price" 
          value={`$${averagePrice}`} 
          color="from-purple-500 to-purple-600" 
        />
        <StatCard 
          icon={<Eye className="w-6 h-6" />} 
          title="Total Views" 
          value={totalViews.toLocaleString()} 
          color="from-emerald-500 to-emerald-600" 
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center">
      <div className={`p-3.5 bg-gradient-to-br ${color} rounded-xl text-white mr-4 shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default ProductsSection;