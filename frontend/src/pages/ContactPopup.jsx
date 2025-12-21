import React, { useState, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { actionAPI } from "/src/services/authAPI";
import { useAuth } from "/src/context/AuthContext";

const ContactPopup = ({ product, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        message: `I'm interested in "${product.title}"`
      }));
    }
  }, [user, product.title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setSubmitStatus({
        type: "error",
        message: "Please login to contact"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setSubmitStatus({
        type: "error",
        message: "All fields are required"
      });
      return;
    }

    if (formData.message.trim().length < 5) {
      setSubmitStatus({
        type: "error",
        message: "Message must be 5+ characters"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Enter valid email"
      });
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      await actionAPI.contactSeller(product._id || product.id, {
        message: formData.message.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });
      
      setSubmitStatus({ 
        type: "success", 
        message: "Message sent! Seller will reply soon." 
      });
      
      setTimeout(() => onClose(), 1500);
      
    } catch (error) {
      setSubmitStatus({ 
        type: "error", 
        message: error.response?.data?.message || "Failed to send" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-8 pb-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-blue-800">Contact Seller</h2>
              <p className="text-sm text-blue-600 mt-0.5">
                Fast response • Secure communication • 24/7 support
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-2 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-5 py-3 bg-white border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">{product.title}</p>
              <p className="text-lg font-bold text-blue-600">${product.price}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                ✓ Available
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          {/* Status */}
          {submitStatus && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${submitStatus.type === "success" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {submitStatus.message}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="3"
                minLength="5"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="Write your message here..."
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">Minimum 5 characters</p>
                <p className="text-xs text-gray-500">{formData.message.length}/500</p>
              </div>
            </div>
          </div>

          {/* Enhanced Send Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !isAuthenticated}
              className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-medium text-white transition-all duration-300 transform ${
                loading || !isAuthenticated
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-semibold">Sending...</span>
                </>
              ) : !isAuthenticated ? (
                <span>Please Login to Contact</span>
              ) : (
                <>
                  <div className="relative">
                    <Send size={18} className="relative z-10" />
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <span className="font-semibold">Send Message</span>
                </>
              )}
            </button>
            
            {/* Button Info */}
            <div className="mt-2 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Be sure your email and phone is working</span>
              </div>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPopup;