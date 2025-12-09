import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const PendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadPendingProducts();
  }, []);

  const loadPendingProducts = async () => {
    try {
      const response = await adminAPI.getPendingProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to load pending products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveProduct(id, 'approve', 'Product approved by admin');
      loadPendingProducts();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await adminAPI.approveProduct(id, 'reject', reason);
      loadPendingProducts();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Approval</h2>
          <p className="text-gray-600">Review and approve products</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            {products.length} pending
          </span>
        </div>
      </div>

      {/* Products Grid - UPDATED */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All clear!</h3>
          <p className="text-gray-600">No products pending approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-primary-300 overflow-hidden flex flex-col"
            >
              {/* Product Image */}
              {product.images?.[0] && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="text-base font-semibold text-gray-900 truncate mb-1">{product.title}</h3>
                    <p className="text-primary-600 font-bold text-lg">${product.price}</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
                    Pending
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="mb-3 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20 flex-shrink-0">Category:</span>
                    <span className="ml-2 truncate capitalize text-gray-800">{product.category}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20 flex-shrink-0">Location:</span>
                    <span className="ml-2 truncate text-gray-800">{product.location}</span>
                  </div>
                </div>
                
                {/* Posted By */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium flex-shrink-0">
                      {product.postedBy?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.postedBy?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 truncate">{product.postedBy?.email || ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex-shrink-0 ml-2 px-2 py-1 hover:bg-primary-50 rounded"
                  >
                    Details
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                  <button
                    onClick={() => handleApprove(product.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center shadow-sm hover:shadow"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(product.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center shadow-sm hover:shadow"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Product Details - Also updated for consistency */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                {/* Images */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedProduct.title} ${idx + 1}`}
                        className="rounded-lg w-full h-40 object-cover"
                      />
                    ))}
                  </div>
                )}
                
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedProduct.title}</h4>
                    <p className="text-primary-600 text-2xl font-bold mt-1">${selectedProduct.price}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-medium capitalize text-gray-800">{selectedProduct.category}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-800">{selectedProduct.location}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Price Type</p>
                      <p className="font-medium capitalize text-gray-800">{selectedProduct.priceType}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2 font-medium">Description</p>
                    <p className="text-gray-700">{selectedProduct.description}</p>
                  </div>
                  
                  {/* Posted By */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-3 font-medium">Posted By</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-xl">
                        {selectedProduct.postedBy?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{selectedProduct.postedBy?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedProduct.postedBy?.email || ''}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedProduct.postedBy?.phone || ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleApprove(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow"
                  >
                    Approve Product
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow"
                  >
                    Reject Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingProducts;