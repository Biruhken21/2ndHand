// components/profile/MyProducts.jsx
import React, { useEffect, useState } from "react";
import { productAPI } from "../../services/authAPI.js";
import { Edit, Eye, Heart, Tag, MapPin, DollarSign, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProducts = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getMyProducts();
        const productsData = response?.products || [];
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [userId]);

  const handleMarkAsSold = async (productId) => {
    try {
      await productAPI.markAsSold(productId);
      setProducts(products.map(p => 
        (p.id === productId || p._id === productId) 
          ? { ...p, status: 'sold' }
          : p
      ));
      alert("Product marked as sold!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark as sold.");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Delete this product?")) {
      try {
        await productAPI.deleteProduct(productId);
        setProducts(products.filter(p => 
          p.id !== productId && p._id !== productId
        ));
        alert("Product deleted!");
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-600 mb-2"></div>
        <p className="text-gray-500 text-sm">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-gray-700 font-medium mb-1">No products yet</h3>
        <p className="text-gray-500 text-sm mb-6">Start selling by adding your first product</p>
        <button
          onClick={() => navigate("/create-product")}
          className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
        >
          + Add Product
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-800">My Products ({products.length})</h3>
        <button
          onClick={() => navigate("/create-product")}
          className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
        >
          + Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const productId = product.id || product._id;
          const isSold = product.status === 'sold';
          const isDescriptionOpen = showDescription === productId;

          return (
            <div
              key={productId}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
            >
              {/* Image */}
              <div 
                className="relative h-40 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${productId}`)}
              >
                <img
                  src={product.images?.[0] || product.image || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isSold ? 'bg-gray-600 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {isSold ? 'SOLD' : 'ACTIVE'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Title and Price */}
                <div className="mb-3">
                  <h4 
                    className="font-medium text-gray-800 cursor-pointer hover:text-purple-600"
                    onClick={() => navigate(`/product/${productId}`)}
                  >
                    {product.title}
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-purple-600 font-bold">
                      <DollarSign className="inline w-4 h-4" />
                      {product.price}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {product.views || 0}
                      <Heart className="w-3 h-3 ml-3 mr-1" />
                      {product.likes || 0}
                    </div>
                  </div>
                </div>

                {/* Category and Location */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.category && (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      <Tag className="inline w-3 h-3 mr-1" />
                      {product.category}
                    </span>
                  )}
                  {product.location && (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {product.location}
                    </span>
                  )}
                </div>

                {/* Action Buttons - EDIT, MARK AS SOLD, DELETE */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  {/* Left side: Description toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDescription(isDescriptionOpen ? null : productId);
                    }}
                    className="text-purple-600 hover:text-purple-800 text-sm"
                  >
                    {isDescriptionOpen ? "Hide" : "View"} Description
                  </button>

                  {/* Right side: Action icons */}
                  <div className="flex items-center space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${productId}/edit`);
                      }}
                      className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Mark as Sold Button (only if not sold) */}
                    {!isSold && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsSold(productId);
                        }}
                        className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Mark as Sold"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(productId);
                      }}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description Popup (when toggled) */}
                {isDescriptionOpen && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-gray-600 text-sm">
                      {product.description || "No description available."}
                    </p>
                  </div>
                )}

                {/* Created Date */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Listed: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyProducts;