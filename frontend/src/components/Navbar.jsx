import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';
import {
  ShoppingCart,
  Bell,
  Home,
  Menu,
  X,
  User,
  LogOut,
  UserPlus,
  LogIn
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get auth data from context
  const { user, isAuthenticated, logout } = useAuth();

  const userName = user?.name || "User";

  // Logout handler
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    Navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">UP</span>
              </div>
              <span className="text-gray-900 text-2xl font-bold tracking-tight hidden sm:block">
                UserProduct
              </span>
            </Link>
          </div>

          {/* Home Link – Center */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-purple-600 transition-all duration-200 font-medium rounded-lg hover:bg-gray-50"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              // LOGGED IN UI
              <div className="flex items-center space-x-6">

                {/* Cart Icon */}
                <button className="relative group">
                  <div className="p-2.5 rounded-lg bg-gray-50 group-hover:bg-purple-50 transition-all duration-200">
                    <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                      3
                    </span>
                  </div>
                </button>

                {/* Notifications */}
                <button className="relative group">
                  <div className="p-2.5 rounded-lg bg-gray-50 group-hover:bg-yellow-50 transition-all duration-200">
                    <Bell className="h-5 w-5 text-gray-600 group-hover:text-yellow-600 transition-colors" />
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                      5
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-gray-900 font-semibold text-sm leading-tight">
                        {userName}
                      </p>
                      <p className="text-gray-500 text-xs">Premium Member</p>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 mt-1 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // NOT LOGGED IN UI
              <div className="hidden md:flex items-center space-x-4">
                {/* Guest User */}
                <div className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-300">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Guest User</p>
                    <p className="text-xs text-gray-500">Sign in for more</p>
                  </div>
                </div>

                {/* Login */}
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>

                {/* Signup */}
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-2xl mt-3 p-6 border border-gray-200 shadow-xl">
            <div className="space-y-4">

              {/* Mobile Home */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-4 px-4 py-3.5 text-gray-700 hover:text-purple-600 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Mobile user badge */}
                  <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{userName}</p>
                        <p className="text-sm text-gray-600">Premium Member</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-4 px-4 py-3.5 text-gray-700 hover:text-purple-600 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">My Profile</span>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 mt-4 px-4 py-3.5 text-red-600 font-medium rounded-xl border-2 border-red-100 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Guest User */}
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-300">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Guest User</p>
                        <p className="text-sm text-gray-600">Sign in for full access</p>
                      </div>
                    </div>
                  </div>

                  {/* Login */}
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>

                  {/* Sign Up */}
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
