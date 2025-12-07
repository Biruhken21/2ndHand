import React from 'react';
import { 
  Package, MapPin, Calendar, Eye, Heart, 
  Share2, MessageCircle, PlusCircle, 
  DollarSign 
} from 'lucide-react';

const ProductsSection = ({
  loadingProducts,
  filteredProducts,
  viewMode,
  searchTerm,
  selectedCategory,
  categories,
  setShowPostForm,
  products
}) => {
  // Calculate stats
  const totalProducts = products.length;
  const averagePrice = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
    : '0.00';
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

  // Loading state
  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // No products state
  if (filteredProducts.length === 0) {
    return (
      <>
        <div className="text-center py-16 bg-white rounded-2xl shadow">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try a different search term' : selectedCategory !== 'all' ? 'No products in this category' : 'No approved products yet'}
          </p>
          <button
            onClick={() => setShowPostForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Be the first to post!
          </button>
        </div>
        
        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-xl text-white mr-4">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Total Products</p>
                <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 rounded-xl text-white mr-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Average Price</p>
                <p className="text-2xl font-bold text-purple-900">${averagePrice}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-xl text-white mr-4">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-green-700">Total Views</p>
                <p className="text-2xl font-bold text-green-900">{totalViews}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.priceType === 'fixed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {product.priceType}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex space-x-1">
                  {product.images.slice(0, 3).map((_, index) => (
                    <div key={index} className="w-2 h-2 rounded-full bg-white bg-opacity-80"></div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{product.title}</h3>
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 mb-5">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <span className="text-sm">{product.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition text-sm font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Image */}
                <div className="md:w-1/4 mb-4 md:mb-0">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 md:h-32 object-cover rounded-xl"
                  />
                </div>
                
                {/* Details */}
                <div className="md:w-3/4 md:pl-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.priceType === 'fixed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {product.priceType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categories.find(c => c.value === product.category)?.color}`}>
                          {categories.find(c => c.value === product.category)?.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">${product.price}</div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {product.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {product.views} views
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition text-sm font-semibold">
                        Contact Seller
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-xl text-white mr-4">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Total Products</p>
              <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-xl text-white mr-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Average Price</p>
              <p className="text-2xl font-bold text-purple-900">${averagePrice}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-xl text-white mr-4">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-green-700">Total Views</p>
              <p className="text-2xl font-bold text-green-900">{totalViews}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsSection;