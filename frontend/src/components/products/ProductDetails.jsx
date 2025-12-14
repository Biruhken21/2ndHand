import React, { useState } from "react";
import { X, Eye } from "lucide-react";

const ProductDetails = ({ product, categories, onClose }) => {
  const [showFull, setShowFull] = useState(false);
  const fullDescription = product.fullDescription || product.description || "";
  const categoryObj = categories.find(c => c.value === product.category) || {};

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
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
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 justify-items-center">
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
            <p className="text-3xl font-bold text-blue-600 mt-1">${product.price}</p>
          </div>

          {/* Category / Location / PriceType / Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Category</span>
              <span className="font-medium text-gray-800">{categoryObj.label || product.category}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Location</span>
              <span className="font-medium text-gray-800">{product.location}</span>
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
                showFull ? "max-h-full" : "max-h-36 overflow-hidden"
              }`}
            >
              {fullDescription}
            </p>

            {fullDescription.length > 180 && (
              <div className="absolute bottom-2 right-4">
                <button
                  onClick={() => setShowFull(!showFull)}
                  className="text-blue-600 font-semibold hover:underline text-sm"
                >
                  {showFull ? "Show less" : "Read more"}
                </button>
              </div>
            )}

            {/* Fade effect when collapsed */}
            {!showFull && fullDescription.length > 180 && (
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg"></div>
            )}
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 text-gray-700">
            <Eye size={18} />
            <span className="font-medium">{product.views || 0} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
