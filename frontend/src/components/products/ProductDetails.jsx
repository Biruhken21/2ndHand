import React, { useState } from "react";
import { X, Eye, DollarSign, Tag, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDetails = ({ product, categories, onClose }) => {
  if (!product) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-600 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-4">The product data is not available.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [showFullDesc, setShowFullDesc] = useState(false);
  const fullDescription = product.fullDescription || product.description || "";
  const categoryObj = categories?.find(c => c.value === product.category) || {};

  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Images Grid */}
          {product.images?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="h-48 w-full max-w-[220px] rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-transform hover:scale-105"
                >
                  <img
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Title and Price */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              <DollarSign className="inline w-5 h-5" /> {product.price}
            </p>
          </div>

          {/* Category / Location / PriceType / Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Category</span>
              <span className="font-medium text-gray-800">{categoryObj.label || product.category || "N/A"}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Location</span>
              <span className="font-medium text-gray-800">{product.location || "N/A"}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Price Type</span>
              <span className="font-medium capitalize text-gray-800">{product.priceType || "Fixed"}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Status</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium text-center">
                {product.status || "Pending"}
              </span>
            </div>
          </div>

          {/* Description with toggle */}
          <div className="bg-gray-50 p-4 rounded-lg relative">
            <h3 className="font-semibold mb-2 text-gray-900">Description</h3>
            <p
              className={`text-gray-700 whitespace-pre-line transition-all duration-300 ${
                showFullDesc ? "max-h-full" : "max-h-36 overflow-hidden"
              }`}
            >
              {fullDescription || "No description available."}
            </p>

            {fullDescription.length > 180 && (
              <div className="mt-2 text-right">
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="text-blue-600 font-semibold hover:underline text-sm"
                >
                  {showFullDesc ? "Show less" : "Read more"}
                </button>
              </div>
            )}
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 text-gray-700">
            <Eye size={18} />
            <span className="font-medium">{product.views || 0} views</span>
          </div>

          {/* Similar Products */}
          {product.similarProducts?.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Similar Products</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {product.similarProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    <div className="h-40 w-full overflow-hidden">
                      <img
                        src={p.image || "/placeholder.png"}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-gray-800 text-sm mb-1">{p.title}</h5>
                      <p className="text-blue-600 font-bold">
                        <DollarSign className="inline w-4 h-4" /> {p.price}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{p.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
