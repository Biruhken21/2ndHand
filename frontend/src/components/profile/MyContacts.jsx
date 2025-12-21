// components/profile/MyContacts.jsx
import React, { useEffect, useState } from "react";
import { actionAPI } from "../../services/authAPI.js";
import { MessageCircle, Calendar, MapPin, Tag, Eye, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyContacts = ({ userId }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchMyContacts = async () => {
      try {
        setLoading(true);
        const response = await actionAPI.getContactedProducts();
        const contactsData = response?.products || [];
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyContacts();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mb-2"></div>
        <p className="text-gray-500 text-sm">Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-gray-700 font-medium mb-1">No contacted products</h3>
        <p className="text-gray-500 text-sm">You haven't contacted any sellers yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Contacted Products ({contacts.length})</h3>
        <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          All Contacts
        </span>
      </div>

      <div className="space-y-3">
        {contacts.map((contact, index) => {
          const product = contact.product || contact;
          const inquiry = contact.inquiry || {};
          const productId = product?.id || product?._id || index;

          return (
            <div
              key={productId}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-16 h-16 rounded overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${productId}`)}
                  >
                    <img
                      src={product?.image || product?.images?.[0] || "/placeholder.png"}
                      alt={product?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  {/* Title and Price */}
                  <div className="flex justify-between items-start mb-1">
                    <h4 
                      className="font-medium text-gray-800 truncate cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/product/${productId}`)}
                    >
                      {product?.title || "Product"}
                    </h4>
                    <span className="text-blue-600 font-bold text-sm">
                      <DollarSign className="inline w-3 h-3" />
                      {product?.price || "0"}
                    </span>
                  </div>

                  {/* Category and Location */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product?.category && (
                      <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        <Tag className="w-3 h-3 mr-1" />
                        {product.category}
                      </span>
                    )}
                    {product?.location && (
                      <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.location}
                      </span>
                    )}
                  </div>

                  {/* Inquiry Message Preview */}
                  {inquiry?.message && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1 italic">
                      "{inquiry.message}"
                    </p>
                  )}

                  {/* Contact Date and Actions */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {inquiry.date || inquiry.createdAt 
                        ? new Date(inquiry.date || inquiry.createdAt).toLocaleDateString()
                        : "Recently"
                      }
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/product/${productId}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/chat/${product?.sellerId || product?.postedBy}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyContacts;