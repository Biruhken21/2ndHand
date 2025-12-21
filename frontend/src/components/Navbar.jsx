import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';
import { actionAPI } from '/src/services/authAPI.js';
import Notifications from '/src/pages/Notification';
import {
  ShoppingCart,
  Bell,
  Home,
  Menu,
  X,
  Heart
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const userName = user?.name || 'U';

  useEffect(() => {
    if (isAuthenticated) fetchCounts();
  }, [isAuthenticated]);

  const fetchCounts = async () => {
    try {
      const favRes = await actionAPI.getFavorites();
      setFavoritesCount((favRes?.favorites || []).length);

      const notifRes = await actionAPI.getUserNotifications();
      const unread = (notifRes?.notifications || []).filter(n => !n.isRead).length;
      setNotificationsCount(unread);
    } catch {
      setFavoritesCount(0);
      setNotificationsCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
                UP
              </div>
              <span className="font-semibold text-lg hidden sm:block">
                UserProduct
              </span>
            </Link>

            {/* CENTER HOME */}
            <div className="hidden md:flex">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Home />
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">

              {isAuthenticated && (
                <>
                  {/* ICON GROUP */}
                  <div className="flex items-center gap-3">

                    {/* FAVORITES */}
                    <Link
                      to="/favorites"
                      className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <Heart className="w-5 h-5 text-gray-700" />
                      {favoritesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                          {favoritesCount > 9 ? '9+' : favoritesCount}
                        </span>
                      )}
                    </Link>

                    {/* NOTIFICATIONS */}
                    <button
                      onClick={() => setShowNotifications(true)}
                      className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <Bell className="w-5 h-5 text-gray-700" />
                      {notificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                          {notificationsCount > 9 ? '9+' : notificationsCount}
                        </span>
                      )}
                    </button>

                  </div>

                  {/* PROFILE */}
                  <div className="relative group ml-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer">
                      {userName.charAt(0).toUpperCase()}
                    </div>

                    {/* DROPDOWN */}
                    <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border opacity-0 group-hover:opacity-100 transition">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/favorites"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Favorites
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link to="/login" className="px-4 py-2 border rounded-lg">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* MOBILE */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* NOTIFICATIONS MODAL */}
      {showNotifications && (
        <Notifications onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};

export default Navbar;
