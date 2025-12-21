import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyProducts from "../components/profile/MyProducts.jsx";
import MyContacts from "../components/profile/MyContacts.jsx";

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("my-products");
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { logout(); navigate("/"); }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("my-products")}
              className={`px-6 py-3 font-medium ${activeTab === "my-products" 
                ? "border-b-2 border-purple-600 text-purple-600" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              My Products
            </button>
            <button
              onClick={() => setActiveTab("contacted")}
              className={`px-6 py-3 font-medium ${activeTab === "contacted" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Contacted Products
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          {activeTab === "my-products" ? (
            <MyProducts userId={user.id} />
          ) : (
            <MyContacts userId={user.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;