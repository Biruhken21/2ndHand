// pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { actionAPI } from '../services/authAPI.js';
import { Heart, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await actionAPI.getFavorites();
      const favoritesData = response?.data || response?.favorites || [];
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await actionAPI.toggleFavorite(productId);
      setFavorites(favorites.filter(fav => {
        const favProduct = fav.product || fav;
        return favProduct.id !== productId && favProduct._id !== productId;
      }));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-600 mb-3"></div>
          <p className="text-gray-500 text-sm">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-600 font-medium text-base mb-1">No favorites yet</h3>
          <p className="text-gray-400 text-sm">Products you like will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <Heart className="w-5 h-5 text-pink-500" />
            <span className="text-base font-medium text-gray-700">
              My Favorites <span className="text-pink-500">({favorites.length})</span>
            </span>
          </div>
        </div>

        {/* Favorites Grid - 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((favorite, index) => {
            const product = favorite.product || favorite;
            const productId = product.id || product._id || index;

            return (
              <div
                key={productId}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image Section */}
                <div 
                  className="relative h-56 overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/product/${productId}`)}
                >
                  <img
                    src={product.images?.[0] || product.image || "/placeholder.png"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  
                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(productId);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Title */}
                  <h3 
                    className="font-medium text-gray-800 truncate cursor-pointer hover:text-purple-600 mb-2"
                    onClick={() => navigate(`/product/${productId}`)}
                    title={product.title}
                  >
                    {product.title}
                  </h3>

                  {/* Price and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span className="text-lg font-bold text-purple-600 ml-1">
                        {product.price}
                      </span>
                    </div>
                    
                    {/* Status */}
                    {product.status && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.status === 'sold' 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {product.status === 'sold' ? 'Sold' : 'Active'}
                      </span>
                    )}
                  </div>

                  {/* Quick Info (optional) */}
                  {(product.category || product.location) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        {product.category && (
                          <span className="truncate mr-3">{product.category}</span>
                        )}
                        {product.location && (
                          <span className="truncate">{product.location}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;