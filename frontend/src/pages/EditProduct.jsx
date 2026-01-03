// components/profile/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { productAPI } from "../services/authAPI.js";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState({
    title: "",
    price: "",
    priceType: "fixed",
    category: "",
    description: "",
    location: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  const categories = [
    { value: "electronics", label: "📱 Electronics" },
    { value: "vehicles", label: "🚗 Vehicles" },
    { value: "furniture", label: "🛋️ Furniture" },
    { value: "appliances", label: "🧊 Appliances" },
    { value: "home", label: "🏠 Home & Garden" },
    { value: "sports", label: "🚴 Sports" },
    { value: "services", label: "🛠️ Services" },
    { value: "other", label: "📦 Other" },
  ];

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProductById(id);
        const data = response?.product || response;

        setProduct({
          title: data.title || "",
          price: data.price || "",
          priceType: data.priceType || "fixed",
          category: data.category || "",
          description: data.description || "",
          location: data.location || "",
          images: data.images || [],
        });

        setPreviewImages(data.images || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to fetch product data.");
        navigate("/profile/my-products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({ ...prev, images: files }));
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key !== "images") formData.append(key, value);
      });

      product.images.forEach((img) => formData.append("images", img));

      await productAPI.updateProduct(id, formData);
      alert("Product updated successfully. Waiting for admin approval!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500 mb-2"></div>
        <p className="text-gray-500 text-sm">Loading product data...</p>
      </div>
    );
  }

  const inputStyle =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm \
     focus:outline-none focus:ring-2 focus:ring-blue-300 \
     hover:border-blue-300 hover:bg-blue-50 transition";

  const selectStyle =
    "w-full border border-gray-300 rounded px-3 py-1.5 text-sm \
     focus:outline-none focus:ring-2 focus:ring-blue-300 \
     hover:border-blue-300 hover:bg-blue-50 transition";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Price + Type */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Type
            </label>
            <select
              name="priceType"
              value={product.priceType}
              onChange={handleChange}
              className={selectStyle}
            >
              <option value="fixed">Fixed</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className={selectStyle}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={product.location}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={product.description}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {previewImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="preview"
                className="w-20 h-20 object-cover rounded hover:ring-2 hover:ring-blue-200 transition"
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded
                     hover:bg-blue-700 transition
                     disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
