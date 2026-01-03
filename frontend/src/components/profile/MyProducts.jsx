import React, { useEffect, useState } from "react";
import { productAPI } from "../../services/authAPI.js";
import { Edit, Eye, Heart, Tag, MapPin, DollarSign, Trash2, CheckCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProducts = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.deleteProduct(productId);
        setProducts(products.filter(p => 
          p.id !== productId && p._id !== productId
        ));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete product.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600 mb-2"></div>
        <p className="text-gray-500 text-sm">Loading your products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-gray-700 font-medium mb-2">No products listed</h3>
        <p className="text-gray-500 text-sm mb-4">Start selling by adding your first product</p>
        <button
          onClick={() => navigate("/create-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const productId = product.id || product._id;
        const isSold = product.status === 'sold';
        const mainImage = product.images?.[0] || product.image || "/placeholder.png";

        return (
          <div
            key={productId}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Product Image */}
              <div 
                className="flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/product/${productId}`)}
              >
                <div className="relative w-full md:w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isSold ? 'bg-red-600 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {isSold ? 'SOLD' : 'ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 
                      className="font-semibold text-gray-900 text-lg mb-1 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/product/${productId}`)}
                    >
                      {product.title}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{product.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{product.likes || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isSold && (
                      <button
                        onClick={() => handleMarkAsSold(productId)}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                      >
                        Mark Sold
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/product/${productId}/edit`)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(productId)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Category and Location */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.category && (
                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                      <Tag className="w-3 h-3" />
                      {product.category}
                    </span>
                  )}
                  {product.location && (
                    <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                    </span>
                  )}
                </div>

                {/* Stats and Date */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Listed: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  
                  {product.updatedAt && product.createdAt !== product.updatedAt && (
                    <div className="flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyProducts;