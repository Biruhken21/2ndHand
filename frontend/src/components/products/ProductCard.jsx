import React, { useState } from "react";
import {
  Heart,
  Share2,
  MapPin,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ProductDetails from "./ProductDetails";

const ProductCard = ({ product, categories }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const images = product.images || [];

  // 🔥 Price type logic
  const priceType =
    product.priceType ||
    (product.negotiable ? "Negotiable" : "Fixed");

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* PRODUCT CARD */}
      <div
        onClick={() => setOpenDetails(true)}
        className="
          group bg-white rounded-xl border
          border-gray-200
          hover:border-blue-500
          focus-within:border-blue-500
          shadow-sm hover:shadow-lg
          transition-all duration-300
          cursor-pointer overflow-hidden
          flex flex-col
        "
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-xl">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}

          <img
            src={images[currentImageIndex]}
            alt={product.title}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* IMAGE NAVIGATION (IF MULTIPLE) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* PRICE TYPE BADGE */}
          <div className="absolute top-3 left-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full shadow ${
                priceType === "Negotiable"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {priceType}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col justify-between flex-1">
          {/* TITLE + PRICE */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {product.title}
            </h3>

            <div className="flex justify-between items-center mt-1">
              <p className="text-blue-600 font-bold text-base">
                ${product.price}
              </p>

              {product.location && (
                <span className="text-xs text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {product.location.split(",")[0]}
                </span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between mt-4">
            {/* FAVORITE + SHARE */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  liked
                    ? "text-red-600 bg-red-50"
                    : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                }`}
              >
                <Heart size={16} strokeWidth={2.2} className={liked ? "fill-current" : ""} />
              </button>

              <button
                onClick={handleShare}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  shared
                    ? "text-green-600 bg-green-50"
                    : "text-gray-500 hover:text-green-600 hover:bg-gray-100"
                }`}
              >
                <Share2 size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* CONTACT BUTTON */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="
                flex items-center gap-2 text-xs font-semibold text-white px-5 py-2 rounded-lg
                bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
                shadow-md hover:shadow-lg
                transition transform hover:-translate-y-0.5
              "
            >
              <MessageCircle size={15} strokeWidth={2.2} />
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {openDetails && (
        <ProductDetails
          product={product}
          categories={categories}
          onClose={() => setOpenDetails(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
