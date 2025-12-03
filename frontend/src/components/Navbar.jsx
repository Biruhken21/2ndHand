import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ShoppingCart,
  Bell,
  Home,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change this based on auth state
  const userName = "John"; // Get from auth context

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Brand Name - Left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-gray-900 text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                UserProduct
              </span>
            </Link>
          </div>

          {/* Home Link - Center */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </div>

          {/* Icons and Auth Buttons - Right */}
          <div className="flex items-center space-x-4">
            
            {/* Cart Icon */}
            <button className="relative text-gray-700 hover:text-purple-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notification Icon */}
            <button className="relative text-gray-700 hover:text-purple-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                5
              </span>
            </button>

            {/* Profile/Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* User Profile Circle with first letter */}
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium hidden lg:block">
                    {userName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login Button */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  Login
                </Link>

                {/* Signup Button */}
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Link>

                {/* User Profile Circle (for non-logged in users) */}
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm border border-gray-300">
                  <span className="text-gray-500">?</span>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-purple-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg mt-2 p-4 border shadow-lg">
            <div className="flex flex-col space-y-4">
              
              {/* Mobile Home Link */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              {/* Mobile Auth Buttons */}
              {!isLoggedIn ? (
                <div className="flex flex-col space-y-3 pt-4 border-t">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                  
                  {/* Mobile User Profile Circle */}
                  <div className="flex items-center justify-center space-x-3 pt-4 border-t">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold border border-gray-300">
                      <span>?</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Guest User</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;