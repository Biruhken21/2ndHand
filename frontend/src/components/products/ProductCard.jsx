import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  MapPin,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import ProductDetails from "./ProductDetails";
import SharePopup from "/src/pages/SharePopup";
import ContactPopup from "/src/pages/ContactPopup";
import { actionAPI } from "/src/services/authAPI";

const ProductCard = ({ product, categories }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const images = product.images || [];
  const priceType = product.priceType || (product.negotiable ? "negotiable" : "fixed");

  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await actionAPI.checkFavoriteStatus(product._id || product.id);
        setLiked(response.isFavorited || false);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (product._id || product.id) {
      checkFavoriteStatus();
    }
  }, [product._id, product.id]);

  // Favorite function - WORKS CORRECTLY
  const handleFavorite = async (e) => {
    e.stopPropagation(); // This prevents the card click
    if (isFavoriteLoading) return;
    
    setIsFavoriteLoading(true);
    const previousLikeState = liked;
    setLiked(!liked);
    
    try {
      await actionAPI.toggleFavorite(product._id || product.id);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setLiked(previousLikeState);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // Share function - WORKS CORRECTLY
  const handleShareClick = (e) => {
    e.stopPropagation(); // This prevents the card click
    setShowSharePopup(true);
  };

  // Contact function - SHOULD WORK LIKE ABOVE
  const handleContact = (e) => {
    e.stopPropagation(); // This prevents the card click
    setShowContactPopup(true);
  };

  // Product details function - called when clicking the card
  const handleCardClick = (e) => {
    // Only open details if not clicking any button
    const isButtonClick = e.target.closest('button') || 
                          e.target.tagName === 'BUTTON' ||
                          e.target.closest('button') !== null;
    
    if (!isButtonClick) {
      setOpenDetails(true);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  return (
    <>
      {/* PRODUCT CARD */}
      <div
        onClick={handleCardClick} // Now it checks if button was clicked
        className="group bg-white rounded-xl border border-gray-200 hover:border-blue-500 focus-within:border-blue-500 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-xl">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}

          {images.length > 0 ? (
            <img
              src={images[currentImageIndex]}
              alt={product.title}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* PRICE TYPE BADGE */}
          <div className="absolute top-3 left-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full shadow ${
                priceType === "negotiable"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {priceType === "negotiable" ? "Negotiable" : "Fixed"}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col justify-between flex-1">
          {/* TITLE + PRICE */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 h-10">
              {product.title}
            </h3>

            <div className="flex justify-between items-center mt-2">
              <p className="text-blue-600 font-bold text-base">
                ${product.price?.toLocaleString() || "0"}
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
                onClick={handleFavorite}
                disabled={isFavoriteLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  liked
                    ? "text-red-600 bg-red-50"
                    : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                } ${isFavoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={liked ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavoriteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart 
                    size={16} 
                    strokeWidth={2.2} 
                    className={liked ? "fill-current" : ""} 
                  />
                )}
              </button>

              <button
                onClick={handleShareClick}
                className="w-8 h-8 rounded-full flex items-center justify-center transition text-gray-500 hover:text-green-600 hover:bg-gray-100"
                title="Share product"
              >
                <Share2 size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* CONTACT BUTTON - Works EXACTLY like favorite/share */}
            <button
              onClick={handleContact}
              className="flex items-center gap-2 text-xs font-semibold text-white px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
              title="Contact seller"
            >
              <MessageCircle size={15} strokeWidth={2.2} />
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* SHARE POPUP */}
      {showSharePopup && (
        <SharePopup
          product={product}
          onClose={() => setShowSharePopup(false)}
        />
      )}

      {/* PRODUCT DETAILS MODAL */}
      {openDetails && (
        <ProductDetails
          product={product}
          categories={categories}
          onClose={() => setOpenDetails(false)}
        />
      )}

      {/* CONTACT POPUP */}
      {showContactPopup && (
        <ContactPopup
          product={product}
          onClose={() => setShowContactPopup(false)}
        />
      )}
    </>
  );
};

export default ProductCard;