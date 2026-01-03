import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Mail, Phone, User, LogOut, Edit, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyProducts from "../components/profile/MyProducts.jsx";
import MyContacts from "../components/profile/MyContacts.jsx";
import { authAPI } from "../services/authAPI.js";
import EditProfile from "./EditProfile.jsx"; // popup component

const Profile = () => {
  const { user, logout, login } = useAuth();
  const [activeTab, setActiveTab] = useState("my-products");
  const [showEdit, setShowEdit] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState(user || null);

  const navigate = useNavigate();

  // Fetch latest profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await authAPI.getProfile();
        setProfileData(res.user);
        login(res.user); // update context
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [login]);

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Centered Container */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Profile</h1>
          <button 
            onClick={() => navigate(-1)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {profileData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{profileData.name}</h2>
              <p className="text-gray-600 text-sm truncate">{profileData.email}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
              >
                <Edit className="h-3 w-3" /> Edit
              </button>
              <button 
                onClick={() => { logout(); navigate("/"); }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
              >
                <LogOut className="h-3 w-3" /> Logout
              </button>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{profileData.email}</p>
              </div>
            </div>

            {profileData.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{profileData.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Account Type</p>
                <p className="text-sm font-medium text-gray-900">{profileData.role || "Standard"}</p>
              </div>
            </div>

            {profileData.createdAt && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(profileData.createdAt).toLocaleDateString('en-US', { month:'short', year:'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-4">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab("my-products")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === "my-products" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab("contacted")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === "contacted" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Contacted
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {activeTab === "my-products" ? (
              <MyProducts userId={profileData.id} />
            ) : (
              <MyContacts userId={profileData.id} />
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <EditProfile 
          user={profileData} 
          onClose={() => setShowEdit(false)} 
          onProfileUpdated={(updatedUser) => {
            setProfileData(updatedUser);
            login(updatedUser);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
