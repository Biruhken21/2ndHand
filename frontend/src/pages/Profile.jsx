import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { authAPI } from "../services/authAPI.js";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await authAPI.getUserProducts(user.id, token);
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Close Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <X className="h-6 w-6 text-gray-700" />
      </button>

      {/* User Info Section */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h1>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-md font-medium text-gray-700 mb-1">Account Details</h2>
            <p className="text-gray-600">Name: {user.name}</p>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/"); // go to home after logout
            }}
            className="mt-4 w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Products Section */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Products</h2>
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">You have not added any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                  <p className="text-purple-600 font-bold mt-2">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
