import React, { useState } from "react";
import { X, AlertCircle, Check, Loader2, Upload } from "lucide-react";
import { adminAPI } from "/src/services/adminAPI";
import { Link } from "react-router-dom";

const PostAds = ({ setShowPostForm, onAdsPosted }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    adTitle: "",
    description: "",
    url: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return setError("Only JPG, PNG, WebP images are allowed.");
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError("Image exceeds 5MB.");
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.adTitle || !formData.description || !formData.url) {
      return setError("Please fill all required fields.");
    }
    if (!image) return setError("Please upload an image for the ad.");

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v.trim()));
    fd.append("image", image);

    setLoading(true);
    try {
      const res = await adminAPI.createAd(fd); // Implement API in backend
      if (res.success) {
        setSuccess("Ad posted successfully!");
        setTimeout(() => {
          setFormData({
            companyName: "",
            adTitle: "",
            description: "",
            url: "",
          });
          removeImage();
          onAdsPosted?.(res.ad || res.data);
          setShowPostForm(false);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Error posting ad.");
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
            <h2 className="text-2xl font-semibold text-gray-900">Post a New Ad</h2>
            <p className="text-gray-500 text-sm mt-1">
              Promote a company or business on our platform!
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
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 w-5 h-5 mt-1" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
              <Check className="text-green-600 w-5 h-5 mt-1" />
              <p className="text-green-700 font-semibold">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="font-medium text-gray-700">Company Name *</label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company or Organization Name"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Ad Title *</label>
                <input
                  name="adTitle"
                  value={formData.adTitle}
                  onChange={handleChange}
                  placeholder="Ad Title"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the ad..."
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400 resize-none h-32"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Website / Landing Page URL *</label>
                <input
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition bg-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Ad Banner/Image *</label>
                <div className="mt-3 border-2 border-dashed p-6 rounded-xl text-center cursor-pointer hover:border-gray-400 transition">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <label htmlFor="imgInput" className="text-blue-600 font-medium cursor-pointer">
                    Click to upload
                  </label>
                  <input
                    id="imgInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {preview && (
                  <div className="relative mt-4 w-full h-40 rounded-xl overflow-hidden shadow-sm">
                    <img src={preview} className="w-full h-full object-cover" alt="Ad Preview" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg shadow-md transition
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> Posting Ad...
                </span>
              ) : (
                "Post Ad"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostAds;
