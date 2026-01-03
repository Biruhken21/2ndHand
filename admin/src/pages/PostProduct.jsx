import React, { useState } from "react";
import { X, AlertCircle, Check, Loader2, Upload } from "lucide-react";
import { adminAPI } from "/src/services/adminAPI";
import { Link } from "react-router-dom";

const PostProduct = ({ setShowPostForm, onProductPosted }) => {
  // Define categories enum
  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "vehicles", label: "Vehicles" },
    { value: "furniture", label: "Furniture" },
    { value: "appliances", label: "Appliances" },
    { value: "home", label: "Home" },
    { value: "sports", label: "Sports" },
    { value: "services", label: "Services" },
    { value: "other", label: "Other" },
  ];

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    priceType: "fixed",
    category: categoryOptions[0].value,
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 2000) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (postError) setPostError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3)
      return setPostError("Maximum 3 images allowed.");

    const validFiles = files.filter((file) => {
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        setPostError("Only JPG, PNG, and WebP images are allowed.");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPostError(`"${file.name}" exceeds 5MB.`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const urls = validFiles.map((img) => URL.createObjectURL(img));
    setImages((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...urls]);
    setPostError("");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price || !formData.location) {
      return setPostError("Please fill all required fields.");
    }
    if (!formData.category) return setPostError("Please select a category.");
    if (images.length === 0) return setPostError("Upload at least one image.");

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v.trim()));
    fd.append("status", "pending");
    images.forEach((img) => fd.append("images", img));

    setLoading(true);
    try {
      const res = await adminAPI.createProduct(fd);
      if (res.success) {
        setPostSuccess("Product posted successfully! Awaiting admin approval.");
        setTimeout(() => {
          setFormData({
            title: "",
            price: "",
            priceType: "fixed",
            category: categoryOptions[0].value,
            location: "",
            description: "",
          });
          previews.forEach((u) => URL.revokeObjectURL(u));
          setImages([]);
          setPreviews([]);
          onProductPosted?.(res.product || res.data);
          setTimeout(() => setShowPostForm(false), 1800);
        }, 1200);
      }
    } catch (err) {
      setPostError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gray-50 p-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <Link to="/admin/dashboard" className="font-semibold text-1xl flex">
                        Back</Link>
            <h2 className="text-2xl font-semibold text-gray-900">Post a New Product</h2>
            <p className="text-gray-500 text-sm mt-1">
              Please describe your product in detail in the description section!
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 transition"
            onClick={() => setShowPostForm(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* Notifications */}
          {postError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 w-5 h-5 mt-1" />
              <p className="text-red-700">{postError}</p>
            </div>
          )}
          {postSuccess && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
              <Check className="text-green-600 w-5 h-5 mt-1" />
              <div>
                <p className="text-green-700 font-semibold">{postSuccess}</p>
                <p className="text-green-600 text-sm">Closing form shortly...</p>
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Title */}
              <div className="md:col-span-2">
                <label className="font-medium text-gray-700">Product Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What are you selling?"
                  disabled={loading}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400"
                />
              </div>

              {/* Price */}
              <div>
                <label className="font-medium text-gray-700">Price ($) *</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400"
                />
              </div>

              {/* Price Type */}
              <div>
                <label className="font-medium text-gray-700">Price Type</label>
                <div className="flex gap-4 mt-2">
                  {["fixed", "negotiable"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={type}
                        name="priceType"
                        checked={formData.priceType === type}
                        onChange={handleChange}
                        className="accent-blue-500"
                      />
                      <span className="capitalize text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="font-medium text-gray-700">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="font-medium text-gray-700">Location *</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength="2000"
                  placeholder="Write detailed product info..."
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400 resize-none h-40"
                />
                <p className="text-right text-xs text-gray-400 mt-1">
                  {formData.description.length}/2000
                </p>
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="font-medium text-gray-700">Images (1–3)</label>
                <div className="mt-3 border-2 border-dashed p-6 rounded-xl text-center cursor-pointer hover:border-gray-400 transition">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <label htmlFor="imgInput" className="text-blue-600 font-medium cursor-pointer">
                    Click to upload
                  </label>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP • Max 5MB each</p>
                  <input
                    id="imgInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={images.length >= 3}
                  />
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={src}
                          className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg shadow-md transition
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> Submitting...
                </span>
              ) : (
                "Post Product"
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              ⏳ Products are reviewed within 24 hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProduct;
